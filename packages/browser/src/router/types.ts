import Path from './enums';

export type NoParams = undefined | void;
export type AccountRoute = [Path.Account, NoParams];
export type DashboardRoute = [Path.Dashboard, NoParams];
export type HomeRoute = [Path.Home, NoParams];
export type OrganizationMemberRoute = [
  Path.OrganizationMember,
  { memberId: string; organizationId: string }
];
export type OrganizationMembersRoute = [
  Path.OrganizationMembers,
  { organizationId: string }
];
export type OrganizationProjectRoute = [
  Path.OrganizationProject,
  { projectId: string; organizationId: string }
];
export type OrganizationProjectsRoute = [
  Path.OrganizationProjects,
  { organizationId: string }
];
export type OrganizationProjectTaskRoute = [
  Path.OrganizationProjectTask,
  { organizationId: string; projectId: string; taskId: string }
];
export type OrganizationRoute = [Path.Organization, { organizationId: string }];
export type OrganizationsRoute = [Path.Organizations, NoParams];
export type ProjectRoute = [Path.Project, { projectId: string }];
export type ProjectsRoute = [Path.Projects, NoParams];
export type RemoveAccountRoute = [Path.RemoveAccount, { tokenId: string }];
export type ResetPasswordRoute = [Path.ResetPassword, NoParams];
export type SettingsRoute = [Path.Settings, NoParams];
export type SignInRoute = [Path.SignIn, NoParams];
export type SignUpRoute = [Path.SignUp, NoParams];
export type SignUpConfirmationRoute = [
  Path.SignUpConfirmation,
  { tokenId: string }
];
export type TaskRoute = [Path.Task, { projectId: string; taskId: string }];
export type UpdatePasswordRoute = [Path.UpdatePassword, { tokenId: string }];

type Route =
  | AccountRoute
  | DashboardRoute
  | HomeRoute
  | OrganizationMemberRoute
  | OrganizationMembersRoute
  | OrganizationProjectRoute
  | OrganizationProjectsRoute
  | OrganizationProjectTaskRoute
  | OrganizationRoute
  | OrganizationsRoute
  | ProjectRoute
  | ProjectsRoute
  | RemoveAccountRoute
  | ResetPasswordRoute
  | SettingsRoute
  | SignInRoute
  | SignUpConfirmationRoute
  | SignUpRoute
  | TaskRoute
  | UpdatePasswordRoute;

export default Route;
