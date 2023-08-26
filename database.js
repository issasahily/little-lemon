import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("littlemon");

export async function createTable() {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "create table if not exists menuitem (id integer primary key not null, uuid text, name text, category text, description text, price integer, image blob);"
        );
      },
      reject,
      resolve
    );
  });
}

export async function getMenuItems() {
  return new Promise((resolve) => {
    db.transaction((tx) => {
      tx.executeSql("select * from menuitem", [], (_, { rows }) => {
        resolve(rows._array);
        console.log("arry", rows._array);
      });
    });
  });
}

export function saveMenuItems(menuItems) {
  db.transaction((tx) => {
    tx.executeSql(
      `insert into menuitem (uuid, name, category, description, price, image) values ${menuItems
        .map(
          (item) =>
            `('${item.id}', '${item.name}', '${
              item.category
            }', "${item.description.slice()}", '${item.price}', '${
              item.image
            }')`
        )
        .join(", ")}`
    );
  });
}

export async function filterByQueryAndCategories(query, activeCategories) {
  return new Promise((resolve, reject) => {
    if (!query) {
      db.transaction((tx) => {
        tx.executeSql(
          `select * from menuitem where ${activeCategories
            .map((category) => `category='${category}'`)
            .join(" or ")}`,
          [],
          (_, { rows }) => {
            resolve(rows._array);
          }
        );
      }, reject);
    } else {
      db.transaction((tx) => {
        tx.executeSql(
          `select * from menuitem where (name like '%${query}%') and (${activeCategories
            .map((category) => `category='${category}'`)
            .join(" or ")})`,
          [],
          (_, { rows }) => {
            resolve(rows._array);
          }
        );
      }, reject);
    }
  });
}
export async function deleteTable() {
  return new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql("drop table menuitem");
      },
      reject,
      resolve
    );
  });
}
