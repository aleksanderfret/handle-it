enum Path {
  Account = '/account',
  Dashboard = '/dashboard',
  Home = '/',
  Organization = '/organizations/:organizationId',
  OrganizationMember = '/organizations/:organizationId/members/:memberId',
  OrganizationMembers = '/organizations/:organizationId/members',
  OrganizationProject = '/organizations/:organizationId/projects/:projectId',
  OrganizationProjects = '/organizations/:organizationId/projects',
  OrganizationProjectTask = '/organizations/:organizationId/projects/:projectId/task/:taskId',
  Organizations = '/organizations',
  Project = '/projects/:projectId',
  Projects = '/projects',
  RemoveAccount = '/remove-account/:tokenId',
  ResetPassword = '/reset-password',
  Settings = '/settings',
  SignIn = '/sign-in',
  SignUp = '/sign-up',
  SignUpConfirmation = '/sign-up-confirmation/:tokenId',
  Task = '/projects/:projectId/task/:taskId',
  UpdatePassword = '/update-password/:tokenId'
}

export default Path;
