// @flow

export default class ServiceBase {
  constructor(realm, Schema, objectFriendlyName) {
    this.realm = realm;
    this.Schema = Schema;
    this.messagePrefix = `No ${objectFriendlyName} found with Id: `;
  }

  create = async info =>
    new Promise((resolve, reject) => {
      try {
        this.realm.write(() => {
          resolve(this.realm.create(this.Schema.name, info, true));
        });
      } catch (error) {
        reject(error);
      }
    });

  read = async id =>
    new Promise((resolve, reject) => {
      const objects = this.realm.objects(this.Schema.name).filtered('id = ' + id);

      if (objects.length === 0) {
        reject(this.messagePrefix + id);
      } else {
        resolve(objects[0]);
      }
    });

  update = async info => this.create(info);

  delete = async id =>
    new Promise((resolve, reject) => {
      try {
        this.realm.write(() => {
          const info = this.read(id);

          this.realm.delete(info);

          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });

  search = async () =>
    new Promise(resolve => {
      resolve(this.realm.objects(this.Schema.name));
    });
}
