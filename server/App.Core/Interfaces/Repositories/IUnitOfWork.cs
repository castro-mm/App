using App.Core.Entities.Base;

namespace App.Core.Interfaces.Repositories;

public interface IUnitOfWork : IDisposable
{
    // Adicione aqui repositórios específicos quando necessário
    // Exemplo: IRepository<MinhaEntidade> MinhaEntidadeRepository { get; }
    IRepository<T> Repository<T>() where T : Entity;
    Task<bool> SaveAllAsync();
}
