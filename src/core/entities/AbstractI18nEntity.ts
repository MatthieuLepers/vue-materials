import AbstractEntity, { type EntityData } from '@/core/entities/AbstractEntity';

import i18n from '@/plugins/i18n';

export interface II18nModel {
  locale: string;
  [key: string]: string;
}

export interface IRemoteI18nModel {
  dataValues: II18nModel;
}

export type I18nEntityData = { i18n: IRemoteI18nModel[] } & EntityData;

export default abstract class AbstractI18nEntity<T extends I18nEntityData> extends AbstractEntity<T> {
  constructor(
    data: T,
    ignoreMapping: string[] = [],
  ) {
    super(data, ['i18n', ...ignoreMapping]);
  }

  get i18n(): Record<string, II18nModel> {
    return this.data.i18n.reduce((acc: Record<string, II18nModel>, remoteObj: IRemoteI18nModel) => ({
      ...acc,
      [remoteObj.dataValues.locale]: remoteObj.dataValues,
    }), {});
  }

  getI18n(field: string, defaultValue = ''): string {
    return this.i18n[i18n.global.locale.value]?.[field] ?? this.i18n['en-EN']?.[field] ?? defaultValue;
  }
}
