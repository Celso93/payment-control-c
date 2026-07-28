const { GraphQLError } = require('graphql');
const authService = require('../services/authService');
const userService = require('../services/userService');
const employeeService = require('../services/employeeService');
const payrollService = require('../services/payrollService');

function requireAuth(context) {
  if (!context.user) throw new GraphQLError('Autenticação obrigatória.', { extensions: { code: 'UNAUTHENTICATED' } });
}
const resolvers = {
  Query: {
    usuarios: (_, __, context) => { requireAuth(context); return userService.findAll(); },
    usuario: (_, { id }, context) => { requireAuth(context); return userService.findById(id); },
    funcionarios: (_, __, context) => { requireAuth(context); return employeeService.findAll(); },
    funcionario: (_, { id }, context) => { requireAuth(context); return employeeService.findById(id); },
    processamentos: (_, __, context) => { requireAuth(context); return payrollService.findProcessings(); },
    historicos: (_, args, context) => { requireAuth(context); return payrollService.findHistory({ competencia: args.competencia, funcionarioId: args.funcionario_id }); }
  },
  Mutation: {
    login: (_, { email, senha }) => authService.login(email, senha),
    criarUsuario: (_, { input }) => userService.create(input),
    atualizarUsuario: (_, { id, input }, context) => {
      requireAuth(context);
      if (context.user.id !== id) {
        throw new GraphQLError('Você só pode editar o próprio usuário.', { extensions: { code: 'FORBIDDEN' } });
      }
      return userService.update(id, input);
    },
    criarFuncionario: (_, { input }, context) => { requireAuth(context); return employeeService.create(input); },
    atualizarFuncionario: (_, { id, input }, context) => { requireAuth(context); return employeeService.update(id, input); },
    excluirFuncionario: (_, { id }, context) => { requireAuth(context); return employeeService.remove(id); },
    processarFolha: (_, { competencia }, context) => { requireAuth(context); return payrollService.process(competencia); },
    anularFolha: (_, { competencia }, context) => { requireAuth(context); return payrollService.cancel(competencia); }
  }
};
module.exports = resolvers;
