using App.Core.Entities.Base;

namespace App.Core.Interfaces;

public interface IConvertibleToEntity<TEntity> where TEntity : Entity
{
    TEntity ConvertToEntity();
}
