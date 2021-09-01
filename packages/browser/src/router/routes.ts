import Path from './enums';
import Route, {
  AccountRoute,
  DashboardRoute,
  HomeRoute,
  NoParams,
  OrganizationMemberRoute,
  OrganizationMembersRoute,
  OrganizationProjectRoute,
  OrganizationProjectsRoute,
  OrganizationProjectTaskRoute,
  OrganizationRoute,
  OrganizationsRoute,
  ProjectRoute,
  ProjectsRoute,
  RemoveAccountRoute,
  ResetPasswordRoute,
  SettingsRoute,
  SignInRoute,
  SignUpConfirmationRoute,
  SignUpRoute,
  TaskRoute,
  UpdatePasswordRoute
} from './types';

const createPath = <T extends Route>(path: T[0]) => {
  return (params: T[1]) => {
    if (!params) {
      return path;
    }

    return Object.entries(params as Exclude<T[1], NoParams>).reduce(
      (previousValue: string, [param, value]) =>
        previousValue.replace(`:${param}`, '' + value),
      path
    );
  };
};
export const createAccountRoute = createPath<AccountRoute>(Path.Account);

export const createDashboardRoute = createPath<DashboardRoute>(Path.Dashboard);

export const createHomeRoute = createPath<HomeRoute>(Path.Home);

export const createOrganizationMemberRoute =
  createPath<OrganizationMemberRoute>(Path.OrganizationMember);

export const createOrganizationMembersRoute =
  createPath<OrganizationMembersRoute>(Path.OrganizationMembers);

export const createOrganizationProjectRoute =
  createPath<OrganizationProjectRoute>(Path.OrganizationProject);

export const createOrganizationProjectsRoute =
  createPath<OrganizationProjectsRoute>(Path.OrganizationProjects);

export const createOrganizationProjectTaskRoute =
  createPath<OrganizationProjectTaskRoute>(Path.OrganizationProjectTask);

export const createOrganizationRoute = createPath<OrganizationRoute>(
  Path.Organization
);

export const createOrganizationsRoute = createPath<OrganizationsRoute>(
  Path.Organizations
);

export const createProjectRoute = createPath<ProjectRoute>(Path.Project);

export const createProjectsRoute = createPath<ProjectsRoute>(Path.Projects);

export const createRemoveAccountRoute = createPath<RemoveAccountRoute>(
  Path.RemoveAccount
);

export const createResetPasswordRoute = createPath<ResetPasswordRoute>(
  Path.ResetPassword
);

export const createSettingsRoute = createPath<SettingsRoute>(Path.Settings);

export const createSignInRoute = createPath<SignInRoute>(Path.SignIn);

export const createSignUpConfirmationRoute =
  createPath<SignUpConfirmationRoute>(Path.SignUpConfirmation);

export const createUpdatePasswordRoute = createPath<UpdatePasswordRoute>(
  Path.UpdatePassword
);

export const createSignUpRoute = createPath<SignUpRoute>(Path.SignUp);

export const createTaskRoute = createPath<TaskRoute>(Path.Task);
