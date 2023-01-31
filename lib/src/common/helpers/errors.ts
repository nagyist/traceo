export class TraceoError extends Error {
  public status: number;

  getStatus() {
    return this.status;
  }
}

// "Something was wrong with the request you made."
export class BadRequestError extends TraceoError {
  constructor(message?) {
    super(message || "Something was wrong...");
    this.name = "BadRequestError";
    this.status = 400;
  }
}

// "I know who you are, but you did not have my permission to do this."
export class ForbiddenError extends TraceoError {
  constructor(message?) {
    super(message || "Access denied.");
    this.name = "ForbiddenError";
    this.status = 402;
  }
}

// "You asked for something that I could not find."
export class NotFoundError extends TraceoError {
  constructor(message?) {
    super(message || "Not found.");
    this.name = "NotFoundError";
    this.status = 404;
  }
}

// "I do not know who you are."
export class UnauthorizedError extends TraceoError {
  constructor(message?) {
    super(message || "Unauthorized.");
    this.name = "UnauthorizedError";
    this.status = 401;
  }
}

export class BadPasswordOrNotExists extends TraceoError {
  constructor(message?) {
    super(message || "Bad password or account does not exists.");
    this.name = "BadPasswordOrNotExists";
    this.status = 452;
  }
}

export class AccountNotExistsError extends TraceoError {
  constructor(message?) {
    super(message || "Account not exists.");
    this.name = "AccountNotExistsError";
    this.status = 453;
  }
}

export class AccountEmailAlreadyExistsError extends TraceoError {
  constructor(message?) {
    super(message || "Account with this email already exists.");
    this.name = "AccountEmailAlreadyExistsError";
    this.status = 454;
  }
}

export class AccountWithUsernameAlreadyExistsError extends TraceoError {
  constructor(message?) {
    super(message || "Account with this username already exists.");
    this.name = "AccountWithUsernameAlreadyExistsError";
    this.status = 458;
  }
}

export class ApplicationWithNameAlreadyExistsError extends TraceoError {
  constructor(message?) {
    super(message || "Application with this name already exists.");
    this.name = "ApplicationWithNameAlreadyExistsError";
    this.status = 455;
  }
}

export class AccountAlreadyInApplicationError extends TraceoError {
  constructor(message?) {
    super(message || "This account is already added to this application.");
    this.name = "AccountAlreadyInApplicationError";
    this.status = 455;
  }
}

export class ApplicationNotExistsError extends TraceoError {
  constructor(message?) {
    super(message || "App not exists.");
    this.name = "ApplicationNotExistsError";
    this.status = 456;
  }
}

export class AccountSuspendedError extends TraceoError {
  constructor(message?) {
    super(message || "Account suspended. Please contact with administrator.");
    this.name = "AccountSuspended";
    this.status = 457;
  }
}

export class AdminAccountEditError extends TraceoError {
  constructor(message?) {
    super(message || "The administrator account cannot be edited.");
    this.name = "AdminAccountEditError";
    this.status = 458;
  }
}

export class ProcessIncidentError extends TraceoError {
  constructor(message?) {
    super(message || "Process incident error.");
    this.name = "ProcessIncidentError";
    this.status = 459;
  }
}

export class InternalServerError extends TraceoError {
  constructor(message?) {
    super(message || "Internal server error.");
    this.name = "InternalServerError";
    this.status = 500;
  }
}