import db from '../../../lib/db';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const tableName = searchParams.get('table');
  const columns = searchParams.get('columns') || '*';
  const whereClause = searchParams.get('where');
  const groupBy = searchParams.get('groupBy');
  const havingClause = searchParams.get('having');
  const orderBy = searchParams.get('orderBy');
  const limit = searchParams.get('limit');
  const joins = JSON.parse(searchParams.get('joins') || '[]');

  if (!tableName) {
    return new Response(JSON.stringify({ error: 'Table name is required' }), { status: 400 });
  }

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
}
