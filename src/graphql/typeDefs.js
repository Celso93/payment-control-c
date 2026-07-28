const typeDefs = `#graphql
  type Usuario { id: ID!, email: String!, nome: String!, ativo: Boolean! }
  type Funcionario { id: ID!, cpf: String!, nome: String!, salario_base: Float!, admissao: String!, desligamento: String }
  type Processamento { id: ID!, competencia: String!, data_processamento: String! }
  type HistoricoFuncionario { id: ID!, funcionario_id: ID!, tipo_valor: Int!, valor: Float!, competencia: String! }
  type LoginResponse { token: String!, usuario: Usuario! }

  input CriarUsuarioInput { email: String!, senha: String!, nome: String!, ativo: Boolean }
  input AtualizarUsuarioInput { email: String, senha: String, nome: String, ativo: Boolean }
  input CriarFuncionarioInput { cpf: String!, nome: String!, salario_base: Float!, admissao: String!, desligamento: String }
  input AtualizarFuncionarioInput { cpf: String, nome: String, salario_base: Float, admissao: String, desligamento: String }

  type Query {
    usuarios: [Usuario!]!
    usuario(id: ID!): Usuario
    funcionarios: [Funcionario!]!
    funcionario(id: ID!): Funcionario
    processamentos: [Processamento!]!
    historicos(competencia: String, funcionario_id: ID): [HistoricoFuncionario!]!
  }

  type Mutation {
    login(email: String!, senha: String!): LoginResponse!
    criarUsuario(input: CriarUsuarioInput!): Usuario!
    atualizarUsuario(id: ID!, input: AtualizarUsuarioInput!): Usuario!
    criarFuncionario(input: CriarFuncionarioInput!): Funcionario!
    atualizarFuncionario(id: ID!, input: AtualizarFuncionarioInput!): Funcionario!
    excluirFuncionario(id: ID!): Boolean!
    processarFolha(competencia: String!): Processamento!
    anularFolha(competencia: String!): Boolean!
  }
`;
module.exports = typeDefs;
