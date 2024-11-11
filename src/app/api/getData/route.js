import db from '../../../lib/db';

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
  if (!tableName) {
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
      console.error('Database query error:', error);
      return new Response(JSON.stringify({ error: 'Database query failed' }), { status: 500 });
    }

    // FOR GETTING COLUMN DETAILS
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
      console.error('Database query error:', error);
      return new Response(JSON.stringify({ error: 'Database query failed' }), { status: 500 });
    }

    // FOR GETTING THE TABLE'S PRIMARY KEY
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
      console.error('Error fetching primary key:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch primary key' }), { status: 500 });
    }
  }
}

// FOR ADDING A NEW ENTRY
export async function POST(req) {
  const { tableName, formData } = await req.json();

  if (!tableName || !formData || Object.keys(formData).length === 0) {
    return new Response(JSON.stringify({ error: 'Invalid data' }), { status: 400 });
  }

  try {
    const columns = Object.keys(formData);
    const values = Object.values(formData);

    const query = `INSERT INTO ?? (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`;

    await db.query(query, [tableName, ...values]);

    return new Response(JSON.stringify({ success: true, message: 'Data inserted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Database insertion error:', error);
    return new Response(JSON.stringify({ error: 'Database insertion failed' }), { status: 500 });
  }
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
    console.error('Database update error:', error);
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
    console.error('Database delete error:', error);
    return new Response(JSON.stringify({ error: 'Failed to delete entry' }), { status: 500 });
  }
}
