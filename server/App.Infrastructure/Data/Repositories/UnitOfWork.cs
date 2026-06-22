using App.Core.Entities.Base;
using App.Core.Helpers;
using App.Core.Interfaces.Repositories;
using App.Core.Interfaces.Services.Security;

namespace App.Infrastructure.Data.Repositories;

public class UnitOfWork : IUnitOfWork
{
    private readonly ModeloContext _context;
    private readonly ICurrentUserService _currentUserService;

    public UnitOfWork(ModeloContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }

    // Adicione aqui repositórios específicos quando necessário
    // Exemplo: public IRepository<MinhaEntidade> MinhaEntidadeRepository => FactoryHelper.CreateInstance<MinhaEntidadeRepository>(_context, _currentUserService);

    public IRepository<T> Repository<T>() where T : Entity => FactoryHelper.CreateInstance<Repository<T>>(_context, _currentUserService);

    public async Task<bool> SaveAllAsync() => await _context.SaveChangesAsync() > 0;

    public void Dispose()
    {
        _context.Dispose();
        GC.SuppressFinalize(this);
    }
}