using System.Linq.Expressions;
using App.Core.Entities.Base;
using App.Core.Interfaces;
using App.Core.Interfaces.Repositories;
using App.Core.Interfaces.Services.Security;
using App.Core.Specifications.Base;
using Microsoft.EntityFrameworkCore;

namespace App.Infrastructure.Data.Repositories;

public class Repository<T> : IRepository<T> where T : Entity
{
    private readonly ModeloContext _context;
    private readonly ICurrentUserService _currentUserService;

    public Repository(ModeloContext context, ICurrentUserService currentUserService)
    {
        _context = context;
        _currentUserService = currentUserService;
    }
    
    public async Task<IEnumerable<T>> GetAllAsync(CancellationToken cancellationToken)
    {
        return await _context.Set<T>()
            .Where(x => x.UserId == _currentUserService.UserId)
            .ToListAsync(cancellationToken);
    }

    public async Task<T?> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        return await _context.Set<T>()
            .Where(x => x.UserId == _currentUserService.UserId && x.Id == id)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task AddAsync(T entity, CancellationToken cancellationToken)
    {
        await _context.Set<T>().AddAsync(entity, cancellationToken);
    }

    public void Delete(T entity)
    {
        _context.Remove(entity);
    }

    public void Update(T entity)
    {
        _context.Entry(entity).State = EntityState.Modified;
    }

    public void DeleteRange(IEnumerable<T> entities)
    {
        _context.Set<T>().RemoveRange(entities);
    }

    public async Task<bool> ExistsAsync(int id, CancellationToken cancellationToken)
    {
        return await _context.Set<T>()
            .Where(x => x.UserId == _currentUserService.UserId && x.Id == id)
            .AnyAsync(cancellationToken);
    }

    public async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate, CancellationToken cancellationToken)
    {
        return await _context.Set<T>()
            .Where(x => x.UserId == _currentUserService.UserId)
            .Where(predicate)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<T>> GetAsyncWithSpec(ISpecification<T> spec, CancellationToken cancellationToken)
    {
        var result = SpecificationEvaluator.GetQuery(_context.Set<T>().AsQueryable(), spec);

        return await result.ToListAsync(cancellationToken);
    }

    public async Task<int> CountAsync(ISpecification<T> spec, CancellationToken cancellationToken)
    {
        var query = _context.Set<T>().AsQueryable();

        query = spec.ApplyCriteria(query);

        return await query.CountAsync(cancellationToken);
    }
}
