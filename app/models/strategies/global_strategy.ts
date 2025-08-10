import string from '@adonisjs/core/helpers/string';
import { BaseModel, SnakeCaseNamingStrategy } from '@adonisjs/lucid/orm';
import { LucidModel } from '@adonisjs/lucid/types/model';

export class GlobalNamingStrategy extends SnakeCaseNamingStrategy {
  columnName(_model: typeof BaseModel, propertyName: string) {
    const columnSnakeCase = string.snakeCase(propertyName);

    return columnSnakeCase;
  }
  relationForeignKey(
    relation: 'hasOne' | 'hasMany' | 'belongsTo' | 'manyToMany' | 'hasManyThrough',
    model: LucidModel,
    relatedModel: LucidModel,
  ): string {
    if (relation === 'belongsTo') {
      return string.snakeCase(`${relatedModel.name}_${relatedModel.primaryKey}`);
    }

    return string.snakeCase(`${model.name}_${model.primaryKey}`);
  }

  relationPivotTable(_relation: 'manyToMany', model: typeof BaseModel, relatedModel: typeof BaseModel) {
    return string.snakeCase([relatedModel.name, model.name].sort().join('_'));
  }

  relationPivotForeignKey(_relation: 'manyToMany', model: typeof BaseModel) {
    return string.snakeCase(`${model.name}_${model.primaryKey}`);
  }

  paginationMetaKeys() {
    return {
      total: 'total',
      perPage: 'per_page',
      currentPage: 'current_page',
      lastPage: 'last_page',
      firstPage: 'first_page',
      firstPageUrl: 'first_page_url',
      lastPageUrl: 'last_page_url',
      nextPageUrl: 'next_page_url',
      previousPageUrl: 'previous_page_url',
    };
  }
}
