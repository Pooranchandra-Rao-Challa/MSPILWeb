import {
  RoleDto, RoleViewDto, UserDto, UserViewDto, RolePermissionDto, SecureQuestionDto, UserQuestionDto, ForgotUserPasswordDto, ChangePasswordDto, ThemeDto
} from 'src/app/_models/security';
import { Injectable } from "@angular/core";
import { ApiHttpService } from "./api.http.service";
import {
  CHANGE_PASSWORD_URI, CREATE_ROLE_URI, CREATE_SECURITY_QUESTIONS_URI, CREATE_USER_URI, FORGOT_PASSWORD, GET_ALL_SECTIONS_URI, GET_PERMISSIONS_URI, GET_ROLES_URI, GET_ROLE_PERMISSIONS_URI,
  GET_USERS_URI, GET_USER_SECTIONS_URI, SECURE_QUESTIONS, UPDATE_ROLE_URI, UPDATE_SECURITY_QUESTIONS_URI, UPDATE_THEME_URI, UPDATE_USER_URI, USER_SECURITY_QUESTIONS,
} from "./api.uri.service";
import { SecurityDto } from '../account/securityquestions/securityque.component';

@Injectable({ providedIn: 'root' })
export class SecurityService extends ApiHttpService {

  public GetUsers() {
    return this.get<UserViewDto[]>(GET_USERS_URI);
  }

  public GetUserWithSections(userId: string) {
    return this.getWithId(GET_USER_SECTIONS_URI, userId);
  }

  public CreateUser(userDto: UserDto) {
    return this.post<any>(CREATE_USER_URI, userDto);
  }

  public UpdateUser(userDto: UserDto) {
    return this.post<any>(UPDATE_USER_URI, userDto);
  }

  public GetAllSections() {
    return this.get<any>(GET_ALL_SECTIONS_URI);
  }

  public GetRoles() {
    return this.get<RoleViewDto[]>(GET_ROLES_URI);
  }

  public GetPermissions() {
    return this.get<RolePermissionDto[]>(GET_PERMISSIONS_URI);
  }

  public GetRoleWithPermissions(roleId: string) {
    return this.getWithId(GET_ROLE_PERMISSIONS_URI, roleId);
  }

  public CreateRole(roleDto: RoleDto) {
    return this.post<any>(CREATE_ROLE_URI, roleDto);
  }

  public UpdateRole(roleDto: RoleDto) {
    return this.post<any>(UPDATE_ROLE_URI, roleDto);
  }
  public UserSecurityQuestions(userName: string) {
    return this.getWithParams<UserQuestionDto>(USER_SECURITY_QUESTIONS, [userName]);
  }

  public UpdateForgotPassword(forgotDto: ForgotUserPasswordDto) {
    return this.post(FORGOT_PASSWORD, forgotDto);
  }
  public GetSecureQuestions() {
    return this.get<SecureQuestionDto[]>(SECURE_QUESTIONS);
  }

  public ChangePassword(changePasswordDto: ChangePasswordDto) {
    return this.post<ChangePasswordDto>(CHANGE_PASSWORD_URI, changePasswordDto, { responseType: 'text' });
  }

  public UpdateTheme(themeDto: ThemeDto) {
    return this.post<ThemeDto>(UPDATE_THEME_URI, themeDto);
  }

  public CreateSecurityQuestions(securityQuestions: UserQuestionDto[]) {
    return this.post<UserQuestionDto[]>(CREATE_SECURITY_QUESTIONS_URI, securityQuestions);
  }
  public UpdateSecurityQuestions(securityQuestions: UserQuestionDto) {
    debugger
    
    return this.post<UserQuestionDto>(UPDATE_SECURITY_QUESTIONS_URI, securityQuestions);
  }
}
