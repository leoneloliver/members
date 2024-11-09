const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const membersJson = require('./members.json');

let members = [...membersJson];

const app = express();

const corsOptions = { origin: '*', optionsSuccessStatus: 200 };
app.use(cors(corsOptions));

app.use(bodyParser.json());

// Helper function to update members.json file
const updateMembersFile = () => {
  try {
    fs.writeFileSync(
      path.join(__dirname, 'members.json'),
      JSON.stringify(members, null, 2)
    );
  } catch (err) {
    console.error('Error writing to members.json:', err);
  }
};

// Helper function for sorting
const compareValues = (a, b, direction = 'asc') => {
  const multiplier = direction === 'desc' ? -1 : 1;

  if (Array.isArray(a)) {
    const aValue = a[0] || '';
    const bValue = b[0] || '';
    return multiplier * aValue.localeCompare(bValue);
  }

  if (typeof a === 'string') {
    return multiplier * a.localeCompare(b);
  }

  return multiplier * (a - b);
};

/**
 * @query query: string
 * @query rating: string
 * @query activity: string
 * @query sortField: string
 * @query sortDirection: string
 */
app.get('/members', (req, res) => {
  const { query, rating, activity, sortField, sortDirection } = req.query;
  let filteredMembers = [...members];

  // Filter by name if query exists
  if (query) {
    const q = query.toLowerCase();
    filteredMembers = filteredMembers.filter(member =>
      member?.name?.toLowerCase()?.includes(q)
    );
  }

  // Filter by rating if specified
  if (rating) {
    filteredMembers = filteredMembers.filter(member =>
      member.rating === parseInt(rating)
    );
  }

  // Filter by activity if specified
  if (activity) {
    filteredMembers = filteredMembers.filter(member =>
      member.activities.includes(activity)
    );
  }

  // Apply sorting if specified
  if (sortField && sortDirection) {
    filteredMembers.sort((a, b) =>
      compareValues(a[sortField], b[sortField], sortDirection)
    );
  }

  console.log('GET filtered and sorted /members');
  res.send(filteredMembers);
});

/**
 * @body name: string required
 * @body age: integer
 * @body activities: array[string]
 * @body rating: enum [1-5]
 */
app.post("/members", (req, res) => {
  const body = req.body.body;
  let newMember = body;
  if (body) {
    if (!body.name) {
      res.send("Name is required");
      return;
    }
    newMember = {
      id: Math.floor(10000 + Math.random() * 90000).toString(),
      activities: [],
      ...body,
    };
    members.push(newMember);
    updateMembersFile();
  }
  res.send(newMember);
});

/**
 * @param id: string required
 *
 * @body name: string required
 * @body age: integer
 * @body activities: array[string]
 * @body rating: enum [1-5]
 */
app.patch('/members/:id', (req, res) => {
  console.log('PATCH /members');
  const id = req.params.id;
  const body = req.body.body;

  if (body) {
    members = members.map(member => {
      if (member.id === id) {
        return { ...member, ...body };
      }
      return member;
    });
    updateMembersFile();
  }
  res.send(req.body);
});

/**
 * @param id: string required
 */
app.delete('/members/:id', (req, res) => {
  console.log('DELETE /members');
  const id = req.params.id;

  const memberIndex = members.findIndex(member => member.id === id);

  if (memberIndex !== -1) {
    members.splice(memberIndex, 1);
    updateMembersFile();
    res.send('Member removed successfully');
  } else {
    res.status(404).send('Member not found');
  }
});

const PORT = 4444;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
