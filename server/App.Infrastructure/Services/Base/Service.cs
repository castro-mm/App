using App.Core.Entities.Base;
using App.Core.Interfaces;
using App.Core.Interfaces.Repositories;
using App.Core.Interfaces.Services;
using App.Core.Interfaces.Services.Security;
using App.Core.Objects;

namespace App.Infrastructure.Services.Base;

public abstract class Service<TDto, TEntity> : IService<TDto, TEntity>
    where TDto : IDto, IConvertibleToEntity<TEntity>
    where TEntity : Entity, IConvertibleToDto<TDto>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;

    public Service(IUnitOfWork unitOfWork, ICurrentUserService currentUserService)
    {        
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
    }

    public async Task<PagedResult<TDto>> GetPagedResultWithSpecAsync(ISpecification<TEntity> spec, int pageIndex, int pageSize, CancellationToken cancellationToken)
    {
        var itens = await _unitOfWork.Repository<TEntity>().GetAsyncWithSpec(spec, cancellationToken);
        var count = await _unitOfWork.Repository<TEntity>().CountAsync(spec, cancellationToken);

        var pagination = new PagedResult<TDto>(pageIndex, pageSize, count, itens.Select(x => x.ConvertToDto()));

        return pagination;
    }

    public virtual async Task<IEnumerable<TDto>> GetAllAsync(CancellationToken cancellationToken)
    {
        var lista = await _unitOfWork.Repository<TEntity>().GetAllAsync(cancellationToken);

        return lista.Select(x => x.ConvertToDto());
    }

    public async virtual Task<TDto> GetByIdAsync(int id, CancellationToken cancellationToken)
    {
        var entity = await _unitOfWork.Repository<TEntity>().GetByIdAsync(id, cancellationToken);

        if (entity == null || entity.UserId != _currentUserService.UserId)
            return default!;

        return entity.ConvertToDto();
    }

    public virtual async Task<TDto> CreateAsync(TDto dto, CancellationToken cancellationToken)
    {
        dto.UserId = _currentUserService.UserId;
        var entity = dto.ConvertToEntity();

        await _unitOfWork.Repository<TEntity>().AddAsync(entity, cancellationToken);

        await _unitOfWork.SaveAllAsync();

        return entity.ConvertToDto();
    }

    public virtual async Task<TDto> UpdateAsync(TDto dto, CancellationToken cancellationToken)
    {
        var existingEntity = await _unitOfWork.Repository<TEntity>().GetByIdAsync(dto.Id, cancellationToken);

        if (existingEntity == null || existingEntity.UserId != _currentUserService.UserId)
            return default!;

        dto.UserId = _currentUserService.UserId;
        dto.DataDeAtualizacao = DateTime.Now;
        existingEntity.ConvertFromDto(dto);

        _unitOfWork.Repository<TEntity>().Update(existingEntity);

        await _unitOfWork.SaveAllAsync();

        return existingEntity.ConvertToDto();
    }

    public virtual async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken)
    {
        var entity = await _unitOfWork.Repository<TEntity>().GetByIdAsync(id, cancellationToken);

        if (entity == null || entity.UserId != _currentUserService.UserId)
            return false;

        _unitOfWork.Repository<TEntity>().Delete(entity);

        return await _unitOfWork.SaveAllAsync();
    }

    public virtual async Task<bool> DeleteRangeAsync(IEnumerable<int> ids, CancellationToken cancellationToken)
    {
        var entities = await _unitOfWork.Repository<TEntity>().FindAsync(x => ids.Contains(x.Id), cancellationToken);

        if (!entities.Any())
            return false;

        _unitOfWork.Repository<TEntity>().DeleteRange(entities);

        return await _unitOfWork.SaveAllAsync();
    }

    public virtual async Task<bool> ExistsAsync(int id, CancellationToken cancellationToken)
    {
        var entity = await _unitOfWork.Repository<TEntity>().GetByIdAsync(id, cancellationToken);
        return entity != null;
    }

    public async Task<IEnumerable<TDto>> GetAsyncWithSpec(ISpecification<TEntity> spec, CancellationToken cancellationToken)
    {
        var lista = await _unitOfWork.Repository<TEntity>().GetAsyncWithSpec(spec, cancellationToken);

        return lista.Select(x => x.ConvertToDto());
    }
}

