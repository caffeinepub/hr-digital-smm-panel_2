import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Float "mo:core/Float";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import _Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
    email : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  type User = {
    id : Principal;
    balance : Float;
  };

  module User {
    public func compare(user1 : User, user2 : User) : Order.Order {
      switch (Principal.compare(user1.id, user2.id)) {
        case (#equal) { Float.compare(user1.balance, user2.balance) };
        case (order) { order };
      };
    };
  };

  let users = Map.empty<Principal, User>();

  type FundRequest = {
    id : Nat;
    userId : Principal;
    amount : Float;
    screenshotBlobId : Text;
    status : FundRequestStatus;
    timestamp : Time.Time;
  };

  type FundRequestStatus = {
    #pending;
    #approved;
    #rejected;
  };

  type Service = {
    id : Nat;
    name : Text;
    category : Text;
    serviceType : Text;
    pricePerThousand : Float;
    minQuantity : Nat;
    maxQuantity : Nat;
    isActive : Bool;
    apiServiceId : Text;
  };

  type Order = {
    id : Nat;
    userId : Principal;
    serviceId : Nat;
    link : Text;
    quantity : Nat;
    totalPrice : Float;
    status : OrderStatus;
    apiOrderId : ?Text;
    timestamp : Time.Time;
  };

  type OrderStatus = {
    #pending;
    #processing;
    #completed;
    #cancelled;
  };

  type SupportTicket = {
    id : Nat;
    userId : Principal;
    subject : Text;
    message : Text;
    status : TicketStatus;
    adminReply : ?Text;
    timestamp : Time.Time;
  };

  type TicketStatus = {
    #open;
    #closed;
  };

  let fundRequests = Map.empty<Nat, FundRequest>();
  let services = Map.empty<Nat, Service>();
  let orders = Map.empty<Nat, Order>();
  let tickets = Map.empty<Nat, SupportTicket>();

  func getUserInternal(caller : Principal) : User {
    switch (users.get(caller)) {
      case (null) {
        let newUser : User = {
          id = caller;
          balance = 0.0;
        };
        users.add(caller, newUser);
        newUser;
      };
      case (?user) { user };
    };
  };

  public shared ({ caller }) func getBalance() : async Float {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view balance");
    };
    getUserInternal(caller).balance;
  };

  public shared ({ caller }) func requestFunds(amount : Float, screenshotBlobId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can request funds");
    };
    let id = fundRequests.size();
    let fundRequest : FundRequest = {
      id;
      userId = caller;
      amount;
      screenshotBlobId;
      status = #pending;
      timestamp = Time.now();
    };
    fundRequests.add(id, fundRequest);
  };

  public shared ({ caller }) func approveFundRequest(requestId : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can approve fund requests");
    };
    let fundRequest = switch (fundRequests.get(requestId)) {
      case (null) { Runtime.trap("Fund request not found") };
      case (?request) { request };
    };
    if (fundRequest.status != #pending) {
      Runtime.trap("Only pending requests can be approved");
    };
    let updatedRequest = {
      fundRequest with
      status = #approved;
    };
    fundRequests.add(requestId, updatedRequest);

    let user = getUserInternal(fundRequest.userId);
    let updatedUser = {
      user with
      balance = user.balance + fundRequest.amount;
    };
    users.add(fundRequest.userId, updatedUser);
  };

  public shared ({ caller }) func rejectFundRequest(requestId : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can reject fund requests");
    };
    let fundRequest = switch (fundRequests.get(requestId)) {
      case (null) { Runtime.trap("Fund request not found") };
      case (?request) { request };
    };
    if (fundRequest.status != #pending) {
      Runtime.trap("Only pending requests can be rejected");
    };
    let updatedRequest = {
      fundRequest with
      status = #rejected;
    };
    fundRequests.add(requestId, updatedRequest);
  };

  public shared ({ caller }) func addService(
    name : Text,
    category : Text,
    serviceType : Text,
    pricePerThousand : Float,
    minQuantity : Nat,
    maxQuantity : Nat,
    apiServiceId : Text,
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add services");
    };
    let id = services.size();
    let service : Service = {
      id;
      name;
      category;
      serviceType;
      pricePerThousand;
      minQuantity;
      maxQuantity;
      isActive = true;
      apiServiceId;
    };
    services.add(id, service);
  };

  public shared ({ caller }) func placeOrder(serviceId : Nat, link : Text, quantity : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can place orders");
    };
    let service = switch (services.get(serviceId)) {
      case (null) { Runtime.trap("Service not found") };
      case (?service) { service };
    };
    if (not service.isActive) { Runtime.trap("Service is not active") };
    if (quantity < service.minQuantity or quantity > service.maxQuantity) {
      Runtime.trap("Quantity must be between " # service.minQuantity.toText() # " and " # service.maxQuantity.toText());
    };
    let user = getUserInternal(caller);
    let totalPrice = (quantity.toFloat() / 1000.0) * service.pricePerThousand;
    if (user.balance < totalPrice) {
      Runtime.trap("Insufficient balance");
    };

    let updatedUser = {
      user with
      balance = user.balance - totalPrice;
    };
    users.add(caller, updatedUser);

    let id = orders.size();
    let order : Order = {
      id;
      userId = caller;
      serviceId;
      link;
      quantity;
      totalPrice;
      status = #pending;
      apiOrderId = null;
      timestamp = Time.now();
    };
    orders.add(id, order);
  };

  public shared ({ caller }) func createSupportTicket(subject : Text, message : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create support tickets");
    };
    let id = tickets.size();
    let ticket : SupportTicket = {
      id;
      userId = caller;
      subject;
      message;
      status = #open;
      adminReply = null;
      timestamp = Time.now();
    };
    tickets.add(id, ticket);
  };

  public shared ({ caller }) func replyToTicket(ticketId : Nat, reply : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can reply to tickets");
    };
    let ticket = switch (tickets.get(ticketId)) {
      case (null) { Runtime.trap("Ticket not found") };
      case (?ticket) { ticket };
    };
    let updatedTicket = {
      ticket with
      adminReply = ?reply;
      status = #closed;
    };
    tickets.add(ticketId, updatedTicket);
  };

  public query ({ caller }) func getServices() : async [Service] {
    services.toArray().map(func((_, service)) { service });
  };

  public query ({ caller }) func getUserOrders(userId : Principal) : async [Order] {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own orders");
    };
    orders.values().toArray().filter(func(order) { order.userId == userId });
  };

  public query ({ caller }) func getUserTickets(userId : Principal) : async [SupportTicket] {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own tickets");
    };
    tickets.values().toArray().filter(func(ticket) { ticket.userId == userId });
  };

  public query ({ caller }) func getPendingFundRequests() : async [FundRequest] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view pending fund requests");
    };
    fundRequests.values().toArray().filter(func(request) { request.status == #pending });
  };
};
