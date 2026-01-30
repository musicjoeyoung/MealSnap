import * as SQLite from 'expo-sqlite';

export const database = SQLite.openDatabase('mealsnap.db');

export const executeSql = (
    sql: string,
    params: (string | number | null)[] = []
): Promise<SQLite.SQLResultSet> =>
    new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
                sql,
                params,
                (_, result) => resolve(result),
                (_, error) => {
                    reject(error);
                    return false;
                }
            );
        });
    });
