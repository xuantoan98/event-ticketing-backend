export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

export enum Role {
  ADMIN = 'admin',
  ORGANIZER = 'organizer',
  CUSTOMER = 'customer'
}

export enum Status {
  ACTIVE = 1,
  INACTIVE = 0
}

export enum EventStatus {
  CREATE = 'create',
  PROCESS = 'process',
  END = 'end',
  CLOSED = 'closed',
  CANCELLED = 'cancelled'
}

export enum EventLimitSeat {
  NO_LIMIT = 0,
  LIMIT = 1
}

export enum EventSupportAcceptStatus {
  ACCEPT = 1,
  NO_ACCPET = 0
}

export enum EventCostType {
  IN_COME = 1,
  EXPENSES = 0
}
