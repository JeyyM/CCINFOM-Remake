import db from '@/libs/db';

export async function GET(req) {
  // the paremeters given like a link url
  const { searchParams } = new URL(req.url);

  const type = searchParams.get('type');
  const tableName = searchParams.get('table');
  // makes into * if blank
  const columns = searchParams.get('columns') || '*';
  const whereClause = searchParams.get('where');
  const groupBy = searchParams.get('groupBy');
  const havingClause = searchParams.get('having');
  const orderBy = searchParams.get('orderBy');
  const limit = searchParams.get('limit');
  const joins = JSON.parse(searchParams.get('joins') || '[]');

  const databaseName = process.env.DB_NAME;

  // no table given
  if (!tableName && type !== "tables") {
    return new Response(JSON.stringify({ error: 'Table name is required' }), { status: 400 });
  }

  // FOR QUERYING
  if (type === 'query') {
    let query = `SELECT ${columns} FROM ??`;

    joins.forEach(join => {
      if (join.table && join.on) {
        query += ` ${join.type} JOIN ${join.table} ON ${join.on}`;
      }
    });

    if (whereClause) query += ` WHERE ${whereClause}`;
    if (groupBy) query += ` GROUP BY ${groupBy}`;
    if (havingClause) query += ` HAVING ${havingClause}`;
    if (orderBy) query += ` ORDER BY ${orderBy}`;
    if (limit && !isNaN(limit)) query += ` LIMIT ${parseInt(limit)}`;

    try {
      const [rows] = await db.query(query, [tableName]);
      return new Response(JSON.stringify(rows), { status: 200 });
    } catch (error) {
      // console.error('Database query error:', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    // FOR GETTING COLUMN DETAILS, LIKE THE DATATYPES AND PRIMARY KEYS
  } else if (type === 'columns') {
    const query = `
      SELECT COLUMN_NAME, COLUMN_TYPE, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT, EXTRA
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = ? AND TABLE_SCHEMA = ?
    `;
    try {
      const [columns] = await db.query(query, [tableName, databaseName]);
      return new Response(JSON.stringify(columns), { status: 200 });
    } catch (error) {
      // console.error('Database query error:', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    // FOR GETTING THE TABLE'S PRIMARY KEY
    // NOTE INFORMATION_SCHEMA is how
  } else if (type === 'primaryKey') {
    try {
      const query = `
        SELECT COLUMN_NAME 
        FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
        WHERE TABLE_NAME = ? AND TABLE_SCHEMA = ? AND CONSTRAINT_NAME = 'PRIMARY'
      `;
      const [rows] = await db.query(query, [tableName, databaseName]);
      if (rows.length > 0) {
        return new Response(JSON.stringify({ primaryKey: rows[0].COLUMN_NAME }), { status: 200 });
      } else {
        return new Response(JSON.stringify({ error: 'No primary key found' }), { status: 404 });
      }
    } catch (error) {
      // console.error('Error fetching primary key:', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  } else if (type === 'tables') {
    const query = `
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = ?
    `;
    try {
      const [rows] = await db.query(query, [databaseName]);
      const tableNames = rows.map(row => row.TABLE_NAME);
      return new Response(JSON.stringify(tableNames), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }

}


// TO BE ALPHANUMERIC, SPACE AND UNDERSCORE
const validateTableName = (name) => {
  const regex = /^[a-zA-Z0-9 _]+$/;
  return regex.test(name);
};

// FOR ADDING A NEW ENTRY AND TABLE
export async function POST(req) {
  const { tableName, formData } = await req.json();
  const { searchParams } = new URL(req.url);

  const type = searchParams.get('type');

  // CHECK TABLE NAME
  if (!tableName || !validateTableName(tableName)) {
    return new Response(JSON.stringify({ error: 'Invalid table name' }), { status: 400 });
  }

  // NON-EMPTY
  if (!formData || Object.keys(formData).length === 0) {
    return new Response(JSON.stringify({ error: 'Invalid data' }), { status: 400 });
  }

  console.log(tableName, formData)

  // INSERTING DATA
  if (type === "add") {
    try {
      const columns = Object.keys(formData).map((col) => `\`${col}\``).join(', ');
      const values = Object.values(formData);
      const placeholders = values.map(() => '?').join(', ');

      const query = `INSERT INTO \`${tableName}\` (${columns}) VALUES (${placeholders})`;
      await db.query(query, values);

      return new Response(JSON.stringify({ success: true, message: 'Data inserted successfully' }), { status: 200 });
    } catch (error) {
      console.error('Database insertion error:', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
    //Vienn
  } else if (type === "addPatient") {
    try {
      const columns = Object.keys(formData).map((col) => `\`${col}\``).join(', ');
      const values = Object.values(formData);
      const placeholders = values.map(() => '?').join(', ');

      const query = `INSERT INTO \`${tableName}\` (${columns}) VALUES (${placeholders})`;
      // TODO: Make the address go to person_address and then fetch the address_id then insert into person
      // TODO: Add to patient table
      await db.query(query, values);

      return new Response(JSON.stringify({ success: true, message: 'Data inserted successfully' }), { status: 200 });
    } catch (error) {
      console.error('Database insertion error:', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
    //Vienn
  } else if (type === "addEmployee") {
    try {
      const columns = Object.keys(formData).map((col) => `\`${col}\``).join(', ');
      const values = Object.values(formData);
      const placeholders = values.map(() => '?').join(', ');

      const query = `INSERT INTO \`${tableName}\` (${columns}) VALUES (${placeholders})`;
      await db.query(query, values);
      //TODO Put into staff table
      // TODO Figureout the person address again
      return new Response(JSON.stringify({ success: true, message: 'Data inserted successfully' }), { status: 200 });
    } catch (error) {
      console.error('Database insertion error:', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
    // MAKE A TABLE
  }else if (type === "create") {
    try {
      const fieldDefinitions = formData.map((field) => {
        const nullable = field.nullable ? '' : 'NOT NULL';
        const primaryKey = field.isPrimaryKey ? 'PRIMARY KEY' : '';
        const autoIncrement = field.autoIncrement ? 'AUTO_INCREMENT' : '';
        return `\`${field.name}\` ${field.dataType} ${nullable} ${primaryKey} ${autoIncrement}`.trim();
      }).join(', ');
  
      const query = `CREATE TABLE \`${tableName}\` (${fieldDefinitions})`;
  
      await db.query(query);
  
      return new Response(JSON.stringify({ success: true, message: `Table '${tableName}' created successfully` }), { status: 200 });
    } catch (error) {
      console.error('Database table creation error:', error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  }  

  return new Response(JSON.stringify({ error: error.message }), { status: 400 });
}

// TO EDIT AN ENTRY
export async function PUT(req) {
  try {
    const { tableName, formData, primaryKey, primaryValue } = await req.json();

    if (!tableName || !formData || Object.keys(formData).length === 0 || !primaryKey || !primaryValue) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: tableName, formData, primaryKey, or primaryValue' }),
        { status: 400 }
      );
    }

    const columns = Object.keys(formData);
    const values = Object.values(formData);
    const setClause = columns.map(col => `${col} = ?`).join(', ');

    const query = `UPDATE ?? SET ${setClause} WHERE ${primaryKey} = ?`;
    await db.query(query, [tableName, ...values, primaryValue]);

    return new Response(JSON.stringify({ success: true, message: 'Data updated successfully' }), { status: 200 });

  } catch (error) {
    // console.error('Database update error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Unknown error occurred' }),
      { status: 500 }
    );
  }
}

// TO DELETE AN ENTRY
export async function DELETE(req) {
  const { tableName, primaryKey, primaryValue } = await req.json();

  if (!tableName || !primaryKey || !primaryValue) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  }

  try {
    const query = `DELETE FROM ?? WHERE ?? = ?`;
    await db.query(query, [tableName, primaryKey, primaryValue]);

    return new Response(JSON.stringify({ success: true, message: 'Entry deleted successfully' }), { status: 200 });
  } catch (error) {
    // console.error('Database delete error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
