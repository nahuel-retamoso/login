import { options } from './options/mariaDB.js';
import knex from 'knex';

const db = knex(options);

class ProductosApi {
    listar(id) {
        if (id) {
            return db.from('productos').select('*').where('id', id);
        } else {
            return db.from('productos').select('*');
        }
    }

    listarALL() {
        return db.from('productos').select('*');
    }

    guardar(prod) {
        return db.from('productos').insert(prod);
    }

    actualizar(prod, id) {
        return db.from('productos').where('id', id).update(prod);
    }

    borrar(id) {
        return db.from('productos').where('id', id).del();
    }
}

export default ProductosApi;