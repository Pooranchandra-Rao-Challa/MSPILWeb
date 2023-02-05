export class UserViewDto {
  fullName?: string;
  userId?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  roleId?: string;
  userName?: string;
  email?: string;
  mobileNumber?: string;
  imeino?: number;
  ipaddress?: string;
  iprestriction?: boolean;
  isAdminGate?: boolean;
  isGross?: boolean;
  isTare?: boolean;
  isDumpYard?: boolean;
  isActive?: boolean;
  createdAt?: string;
}

export class UserDto {
  userId?: string
  firstName?: string
  fastName?: string
  userName?: string
  password?: string;
  email?: string
  mobileNumber?: string
  imeino?: string
  ipaddress?: string
  iprestriction?: boolean
  isAdminGate?: boolean
  IsGross?: boolean
  isTare?: boolean
  isDumpYard?: boolean
  isActive?: boolean
  isAdmin?: boolean;
  roleId?: string;
  roles?: RoleDto[];
  userSections?: UserSectionDto[] = [];
}

export class UserSectionDto {
  userSectionId?: number;
  userId?: string;
  sectionId?: number;
  isActive?: boolean
  createdAt?: Date
  createdBy?: string;
  updatedAt?: Date
  updatedBy?: string;
  sectionName?: string;
  userName?: string;
}
export class RoleViewDto {
  roleId?: string
  name?: string
  code?: string
  isActive?: string
  createdBy?: string
  createdAt?: string
  updatedBy?: string
  updatedAt?: string
}

export class RoleDto {
  roleId?: string
  name?: string
  code?: string
  isActive?: boolean
}
