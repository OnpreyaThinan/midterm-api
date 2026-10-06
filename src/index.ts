import { Hono } from 'hono';

type Bindings = {
  campus_booking_db: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// GET /api/equipment
app.get('/api/equipment', async (c) => {
  const result = await c.env.campus_booking_db
    .prepare('SELECT id, name, location FROM equipment ORDER BY id')
    .all();

  return c.json(result.results);
});

// GET /api/bookings
app.get('/api/bookings', async (c) => {
  const result = await c.env.campus_booking_db
    .prepare(`
      SELECT
        id,
        equipment_id AS equipmentId,
        borrower_name AS borrowerName,
        start_at AS startAt,
        end_at AS endAt,
        purpose
      FROM bookings
      ORDER BY start_at
    `)
    .all();

  return c.json(result.results);
});

// GET /api/bookings/:id
app.get('/api/bookings/:id', async (c) => {
  const id = c.req.param('id');

  const booking = await c.env.campus_booking_db
    .prepare(`
      SELECT
        id,
        equipment_id AS equipmentId,
        borrower_name AS borrowerName,
        start_at AS startAt,
        end_at AS endAt,
        purpose
      FROM bookings
      WHERE id = ?
    `)
    .bind(id)
    .first();

  if (!booking) {
    return c.json(
      { error: 'Booking not found.' },
      404
    );
  }

  return c.json(booking, 200);
});

// POST /api/bookings
app.post('/api/bookings', async (c) => {
  const body = await c.req.json();

  const {
    equipmentId,
    borrowerName,
    startAt,
    endAt,
    purpose,
  } = body;

  // Validate required fields
  if (
    !equipmentId ||
    !borrowerName ||
    !startAt ||
    !endAt ||
    !purpose
  ) {
    return c.json(
      { error: 'All booking fields are required.' },
      400
    );
  }

  // Validate date/time
  const start = new Date(startAt);
  const end = new Date(endAt);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime())
  ) {
    return c.json(
      { error: 'startAt and endAt must be valid dates.' },
      400
    );
  }

  if (start >= end) {
    return c.json(
      { error: 'startAt must be before endAt.' },
      400
    );
  }

  // Check equipment exists
  const equipment = await c.env.campus_booking_db
    .prepare('SELECT id FROM equipment WHERE id = ?')
    .bind(equipmentId)
    .first();

  if (!equipment) {
    return c.json(
      { error: 'Equipment not found.' },
      404
    );
  }

  // Check booking overlap
  const conflict = await c.env.campus_booking_db
    .prepare(`
      SELECT id
      FROM bookings
      WHERE equipment_id = ?
        AND start_at < ?
        AND end_at > ?
      LIMIT 1
    `)
    .bind(equipmentId, endAt, startAt)
    .first();

  if (conflict) {
    return c.json(
      { error: 'This equipment is already booked during this time.' },
      409
    );
  }

  // Create booking
  const id = crypto.randomUUID();

  await c.env.campus_booking_db
    .prepare(`
      INSERT INTO bookings (
        id,
        equipment_id,
        borrower_name,
        start_at,
        end_at,
        purpose
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    .bind(
      id,
      equipmentId,
      borrowerName,
      startAt,
      endAt,
      purpose
    )
    .run();

  return c.json(
    {
      id,
      equipmentId,
      borrowerName,
      startAt,
      endAt,
      purpose,
    },
    201
  );
});

// PATCH /api/bookings/:id
app.patch('/api/bookings/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();

  const {
    equipmentId,
    borrowerName,
    startAt,
    endAt,
    purpose,
  } = body;

  // Validate required fields
  if (
    !equipmentId ||
    !borrowerName ||
    !startAt ||
    !endAt ||
    !purpose
  ) {
    return c.json(
      { error: 'All booking fields are required.' },
      400
    );
  }

  // Check booking exists
  const existing = await c.env.campus_booking_db
    .prepare('SELECT id FROM bookings WHERE id = ?')
    .bind(id)
    .first();

  if (!existing) {
    return c.json(
      { error: 'Booking not found.' },
      404
    );
  }

  // Validate date/time
  const start = new Date(startAt);
  const end = new Date(endAt);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime())
  ) {
    return c.json(
      { error: 'startAt and endAt must be valid dates.' },
      400
    );
  }

  if (start >= end) {
    return c.json(
      { error: 'startAt must be before endAt.' },
      400
    );
  }

  // Check equipment exists
  const equipment = await c.env.campus_booking_db
    .prepare('SELECT id FROM equipment WHERE id = ?')
    .bind(equipmentId)
    .first();

  if (!equipment) {
    return c.json(
      { error: 'Equipment not found.' },
      404
    );
  }

  // Check booking overlap, excluding current booking
  const conflict = await c.env.campus_booking_db
    .prepare(`
      SELECT id
      FROM bookings
      WHERE equipment_id = ?
        AND start_at < ?
        AND end_at > ?
        AND id != ?
      LIMIT 1
    `)
    .bind(equipmentId, endAt, startAt, id)
    .first();

  if (conflict) {
    return c.json(
      { error: 'This equipment is already booked during this time.' },
      409
    );
  }

  // Update booking
  await c.env.campus_booking_db
    .prepare(`
      UPDATE bookings
      SET
        equipment_id = ?,
        borrower_name = ?,
        start_at = ?,
        end_at = ?,
        purpose = ?
      WHERE id = ?
    `)
    .bind(
      equipmentId,
      borrowerName,
      startAt,
      endAt,
      purpose,
      id
    )
    .run();

  return c.json(
    {
      id,
      equipmentId,
      borrowerName,
      startAt,
      endAt,
      purpose,
    },
    200
  );
});

// DELETE /api/bookings/:id
app.delete('/api/bookings/:id', async (c) => {
  const id = c.req.param('id');

  const existing = await c.env.campus_booking_db
    .prepare('SELECT id FROM bookings WHERE id = ?')
    .bind(id)
    .first();

  if (!existing) {
    return c.json(
      { error: 'Booking not found.' },
      404
    );
  }

  await c.env.campus_booking_db
    .prepare('DELETE FROM bookings WHERE id = ?')
    .bind(id)
    .run();

  return c.body(null, 204);
});

export default app;