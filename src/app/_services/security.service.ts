import { RoleDto, RoleViewDto, UserDto, UserViewDto, RolePermissionDto, SecureQuestionDto, UserQuestionDto } from './../_models/security';
import { Injectable } from "@angular/core";
import { ApiHttpService } from "./api.http.service";
import { CREATE_ROLE_URI, CREATE_USER_URI, GET_ALL_SECTIONS_URI, GET_PERMISSIONS_URI, GET_ROLES_URI, GET_ROLE_PERMISSIONS_URI, GET_USERS_URI, GET_USER_SECTIONS_URI, UPDATE_ROLE_URI, UPDATE_USER_URI, USER_SECURITY_QUESTIONS, } from "./api.uri.service";


@Injectable({ providedIn: 'root' })
export class SecurityService extends ApiHttpService {

  public GetUsers(){
    return this.get<UserViewDto[]>(GET_USERS_URI);
  }

  public GetUserWithSections(userId:string){
    return this.getWithId(GET_USER_SECTIONS_URI,userId);
  }

  public CreateUser(userDto:UserDto){
    return this.post<any>(CREATE_USER_URI,userDto);
  }

  public UpdateUser(userDto:UserDto){
    return this.post<any>(UPDATE_USER_URI,userDto);
  }

  public GetAllSections(){
    return this.get<any>(GET_ALL_SECTIONS_URI);
  }

  public GetRoles(){
    return this.get<RoleViewDto[]>(GET_ROLES_URI);
  }

  public GetPermissions(){
    return this.get<RolePermissionDto[]>(GET_PERMISSIONS_URI);
  }

  public GetRoleWithPermissions(roleId:string){
    return this.getWithId(GET_ROLE_PERMISSIONS_URI,roleId);
  }

  public CreateRole(roleDto: RoleDto){
    return this.post<any>(CREATE_ROLE_URI,roleDto);
  }

  public UpdateRole(roleDto:RoleDto){
    return this.post<any>(UPDATE_ROLE_URI,roleDto);
  }
  public UserSecurityQuestions(userName: string){
    return this.getWithParams<UserQuestionDto>(USER_SECURITY_QUESTIONS,[userName]);
  }
}
