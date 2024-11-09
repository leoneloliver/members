import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { MdDelete } from 'react-icons/md';
import { FaRegEdit } from 'react-icons/fa';
import { FaSearch } from 'react-icons/fa';
import { IoMdPersonAdd } from 'react-icons/io';
import { MdDirectionsBike } from 'react-icons/md';
import { MdHiking } from 'react-icons/md';
import { FaRunning } from 'react-icons/fa';
import { IoIosSave } from "react-icons/io";
import { MdCancel } from "react-icons/md";
import { CiFilter } from "react-icons/ci";

const getData = async (setMembers, filters = {}, sorting = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (filters.query) queryParams.append('query', filters.query);
    if (filters.rating) queryParams.append('rating', filters.rating);
    if (filters.activity) queryParams.append('activity', filters.activity);
    if (sorting.field) queryParams.append('sortField', sorting.field);
    if (sorting.direction)
      queryParams.append('sortDirection', sorting.direction);

    const queryString = queryParams.toString();
    const res = await axios.get(
      `http://localhost:4444/members${queryString ? `?${queryString}` : ''}`
    );
    setMembers(res.data);
  } catch (err) {
    console.log('ERROR', err);
  }
};

const Block = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  width: 100%;
  padding: 0 5rem;
`;

const Filters = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  margin: 1rem 0;
  gap: 1rem;
  > input {
    max-width: 10rem;
  }
`;

export const Input = styled.input`
  width: ${(props) => props.width || '95%'};
  padding: 0.5rem;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-right: 0.5rem;
`;

const Button = styled.button`
  padding: 0.5rem;
  background: ${(props) => (props.danger ? '#666' : '#000')};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 0.25rem;

  &:hover {
    opacity: 0.8;
  }
  svg {
    width: 18px;
    height: 18px;
  }

  ${(props) =>
    props.withIcon &&
    `
    display: flex;
    align-items: center;
    gap: 0.5rem;
  `}
`;

const Table = styled.table`
  width: calc(100% - 10rem);
  padding: 0 5rem;
  max-width: 100%;
  background: #fff;
  border-radius: 5px;
  border-collapse: collapse;
  box-shadow: 0px 1px 5px 2px #d3d1d1;
`;

const TableBody = styled.tbody`
  tr:nth-child(even) {
    background-color: #f5f5f5;
  }
  tr:nth-child(odd) {
    background-color: transparent;
  }
  color: #444;
`;

export const Thead = styled.thead`
  background: lightgrey;
`;

const TH = styled.th`
  padding: 0.5rem;
  text-align: center;'
  ${(props) => props.width && `width: ${props.width};`}
`;

const THSort = styled(TH)`
  cursor: pointer;
  user-select: none;
  position: relative;

  &:after {
    content: '${(props) => {
      if (props.sorted === 'asc') return ' ↑';
      if (props.sorted === 'desc') return ' ↓';
      return '';
    }}';
    position: absolute;
    margin-left: 5px;
  }

  &:hover {
    background: #e6e6e6;
  }
`;

const Cell = styled.td`
  padding: 0.5rem;
  text-align: center;
  ${(props) => props.width && `width: ${props.width};`}
  span {
    font-size: 0.8rem;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
`;

const FormLabel = styled.label`
  margin-bottom: 0.5rem;
  margin-top: 1rem;
  display: block;
`;

const ActivitySpan = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-right: 8px;
`;

// Helper function to get the appropriate icon for each activity
const ActivityIcon = ({ activity }) => {
  switch (activity) {
    case 'Biking':
      return <MdDirectionsBike />;
    case 'Hiking':
      return <MdHiking />;
    case 'Running':
      return <FaRunning />;
    default:
      return null;
  }
};

export const SearchBar = ({ filters, onFilterChange, onSearch }) => (
  <form
    onSubmit={onSearch}
    style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}
  >
    <Input
      width="240px"
      type="text"
      placeholder="Search for a member"
      value={filters.query || ''}
      onChange={(e) => onFilterChange('query', e.target.value)}
    />
    <Select
      value={filters.rating || ''}
      onChange={(e) => onFilterChange('rating', e.target.value)}
    >
      <option value="">All Ratings</option>
      {[1, 2, 3, 4, 5].map((rating) => (
        <option key={rating} value={rating}>
          {rating} Star{rating !== 1 ? 's' : ''}
        </option>
      ))}
    </Select>
    <Select
      value={filters.activity || ''}
      onChange={(e) => onFilterChange('activity', e.target.value)}
    >
      <option value="">All Activities</option>
      {['Hiking', 'Running', 'Biking'].map((activity) => (
        <option key={activity} value={activity}>
          {activity}
        </option>
      ))}
    </Select>
    <Button type="submit" withIcon>
      <FaSearch />
      <span>Search</span>
    </Button>
  </form>
);

export const Row = ({
  id,
  age,
  name,
  activities,
  rating,
  onEdit,
  onDelete,
}) => (
  <tr key={id}>
    <Cell width="190px">{name}</Cell>
    <Cell width="140px">{age}</Cell>
    <Cell width="140px">{rating}</Cell>
    <Cell align="left">
      {activities.map((activity, i) => (
        <ActivitySpan key={i}>
          <ActivityIcon activity={activity} />
          <span>{activity}</span>
        </ActivitySpan>
      ))}
    </Cell>
    <Cell>
      <Button onClick={() => onEdit()}>
        <FaRegEdit />
      </Button>
      <Button danger onClick={() => onDelete()}>
        <MdDelete />
      </Button>
    </Cell>
  </tr>
);

const MemberForm = ({ member, onSubmit, onClose }) => {
  const [formData, setFormData] = useState(
    member || {
      name: '',
      age: '',
      activities: [],
      rating: 1,
    }
  );

  return (
    <Modal onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h2>{member ? 'Edit Member' : 'Add Member'}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(formData);
          }}
        >
          <div>
            <FormLabel>Name</FormLabel>
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <FormLabel>Age</FormLabel>
            <Input
              type="number"
              value={formData.age}
              onChange={(e) =>
                setFormData({ ...formData, age: parseInt(e.target.value) })
              }
              required
            />
          </div>
          <div>
            <FormLabel>Rating (1-5)</FormLabel>
            <Input
              type="number"
              min="1"
              max="5"
              value={formData.rating}
              onChange={(e) =>
                setFormData({ ...formData, rating: parseInt(e.target.value) })
              }
            />
          </div>
          <div>
            <FormLabel>Activities</FormLabel>
            {['Hiking', 'Running', 'Biking'].map((activity) => (
              <label key={activity}>
                <input
                  type="checkbox"
                  checked={formData.activities.includes(activity)}
                  onChange={(e) => {
                    const activities = e.target.checked
                      ? [...formData.activities, activity]
                      : formData.activities.filter((a) => a !== activity);
                    setFormData({ ...formData, activities });
                  }}
                />{' '}
                {activity}
              </label>
            ))}
          </div>
          <div style={{ marginTop: '1rem' , display: 'flex'}}>
            <Button type="submit" withIcon><IoIosSave /> Save</Button>
            <Button
              withIcon
              type="button"
              style={{ background: '#8c8c8c' }}
              onClick={onClose}
            >
              <MdCancel /> Cancel
            </Button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
};

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [filters, setFilters] = useState({
    query: '',
    rating: '',
    activity: '',
  });
  const [sorting, setSorting] = useState({
    field: '',
    direction: '',
  });
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    getData(setMembers);
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    getData(setMembers, filters, sorting);
  };

  const handleSort = (field) => {
    const newSorting = {
      field,
      direction:
        sorting.field !== field
          ? 'asc'
          : sorting.direction === 'asc'
          ? 'desc'
          : sorting.direction === 'desc'
          ? ''
          : 'asc',
    };
    setSorting(newSorting);
    getData(setMembers, filters, newSorting);
  };

  const handleCreate = async (formData) => {
    try {
      await axios.post('http://localhost:4444/members', { body: formData });
      getData(setMembers, filters, sorting);
      setIsModalOpen(false);
    } catch (err) {
      console.log('ERROR', err);
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await axios.patch(`http://localhost:4444/members/${selectedMember.id}`, {
        body: formData,
      });
      getData(setMembers, filters, sorting);
      setIsModalOpen(false);
      setSelectedMember(null);
    } catch (err) {
      console.log('ERROR', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await axios.delete(`http://localhost:4444/members/${id}`);
        getData(setMembers, filters, sorting);
      } catch (err) {
        console.log('ERROR', err);
      }
    }
  };

  return (
    <Block>
      <h1>My Club's Members</h1>
      <Filters>
        <SearchBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />
        <Button onClick={() => setIsModalOpen(true)} withIcon>
          <IoMdPersonAdd /> Member
        </Button>
      </Filters>
      {isModalOpen && (
        <MemberForm
          member={selectedMember}
          onSubmit={selectedMember ? handleUpdate : handleCreate}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedMember(null);
          }}
        />
      )}
      <Table>
        <Thead>
          <tr>
            <THSort
              onClick={() => handleSort('name')}
              sorted={sorting.field === 'name' ? sorting.direction : ''}
              width="190px"
            >
              Name <CiFilter />
            </THSort>
            <TH width="140px">Age</TH>
            <TH width="140px">Member Rating</TH>
            <THSort
              onClick={() => handleSort('activities')}
              sorted={sorting.field === 'activities' ? sorting.direction : ''}
            >
              Activities <CiFilter />
            </THSort>
            <TH>Actions</TH>
          </tr>
        </Thead>
        <TableBody>
          {members.map((member) => (
            <Row
              {...member}
              key={member.id}
              onEdit={() => {
                setSelectedMember(member);
                setIsModalOpen(true);
              }}
              onDelete={() => handleDelete(member.id)}
            />
          ))}
        </TableBody>
      </Table>
    </Block>
  );
};

export default MemberList;
