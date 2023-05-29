export class UserViewDto {
  fullName?: string;
  userId?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  roleId?: string;
  roleName?: string;
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
  isActive?: boolean
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
  permissions?: RolePermissionDto[]
}
export class RolePermissionDto {
  permissionId?: string
  label?: string
  screenName?: string
  displayName?: string
  assigned?: boolean = false;
}
export class SecureQuestionDto {
  questionId?: number
  question?: string
}
export class UserQuestionDto {
  userQuestionId?: number
  userId?: string
  questionId?: number
  question?: string
  answer?: string
  userAnswer?: string;
}
export class ForgotUserPasswordDto {
  UserName?: string
  Password?: string
  ConfirmPassword?:string;
  UserQuestions?: UserQuestionDto[]
}

export class ChangePasswordDto {
  password?: string
  newPassword?:string;
}
