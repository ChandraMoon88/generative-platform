/**
 * Demo Scenarios
 * Example applications that demonstrate the universal component library
 */

'use client';

import React from 'react';

export default function DemosPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Demo Scenarios</h1>
        <p className="text-lg text-gray-600 mb-8">
          Interactive component demonstrations are available in development mode.
        </p>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Available Demos</h2>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">🍽️</span>
              <div>
                <strong>Restaurant Booking System</strong>
                <p className="text-gray-600">Calendar, forms, and reservation management</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">📋</span>
              <div>
                <strong>Project Management</strong>
                <p className="text-gray-600">Kanban boards, task tracking, and team collaboration</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">🛒</span>
              <div>
                <strong>E-Commerce Store</strong>
                <p className="text-gray-600">Product listings, shopping cart, and checkout flow</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">⚙️</span>
              <div>
                <strong>Admin Dashboard</strong>
                <p className="text-gray-600">User management, data tables, and system settings</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}


  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Navbar
        id="restaurant-nav"
        logo="🍽️ Fine Dining"
        links={[
          { id: 'menu', label: 'Menu', href: '#' },
          { id: 'reservations', label: 'Reservations', href: '#' },
          { id: 'contact', label: 'Contact', href: '#' },
        ]}
        actions={[
          { id: 'book', label: 'Book Table', onClick: () => setShowBookingForm(true) },
        ]}
      />

      <div className="max-w-6xl mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-8">Make a Reservation</h1>

        <MonthCalendar
          id="booking-calendar"
          events={events}
          onDateClick={(date) => {
            setSelectedDate(date);
            setShowBookingForm(true);
          }}
          onEventClick={(event) => console.log('Event clicked:', event)}
        />
      </div>

      <Modal
        id="booking-modal"
        isOpen={showBookingForm}
        onClose={() => setShowBookingForm(false)}
        title="Book Your Table"
        size="lg"
      >
        <UniversalForm
          id="booking-form"
          sections={[
            {
              title: 'Reservation Details',
              fields: [
                { id: 'name', label: 'Full Name', type: 'text', required: true },
                { id: 'email', label: 'Email', type: 'email', required: true },
                { id: 'phone', label: 'Phone', type: 'tel', required: true },
                { id: 'guests', label: 'Number of Guests', type: 'number', required: true, min: 1, max: 12 },
                { id: 'date', label: 'Date', type: 'date', required: true, value: selectedDate?.toISOString().split('T')[0] },
                { id: 'time', label: 'Time', type: 'time', required: true },
                { id: 'notes', label: 'Special Requests', type: 'textarea' },
              ],
            },
          ]}
          onSubmit={(data) => {
            console.log('Booking submitted:', data);
            Toast.success('Reservation confirmed!');
            setShowBookingForm(false);
          }}
        />
      </Modal>
    </div>
  );
}

// ========== PROJECT MANAGEMENT DEMO ==========
function ProjectManagementDemo() {
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const initialColumns = [
    {
      id: 'todo',
      title: 'To Do',
      cards: [
        { id: '1', title: 'Design homepage', description: 'Create mockups', assignee: 'John' },
        { id: '2', title: 'Setup database', description: 'PostgreSQL', assignee: 'Sarah' },
      ],
    },
    {
      id: 'inprogress',
      title: 'In Progress',
      cards: [
        { id: '3', title: 'Implement auth', description: 'JWT tokens', assignee: 'Mike' },
      ],
    },
    {
      id: 'done',
      title: 'Done',
      cards: [
        { id: '4', title: 'Project setup', description: 'Completed', assignee: 'Team' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Navbar
        id="project-nav"
        logo="📋 ProjectHub"
        links={[
          { id: 'board', label: 'Board', href: '#' },
          { id: 'timeline', label: 'Timeline', href: '#' },
          { id: 'reports', label: 'Reports', href: '#' },
        ]}
      />

      <div className="max-w-7xl mx-auto mt-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Development Board</h1>
          <Button
            id="add-task-btn"
            variant="primary"
            onClick={() => console.log('Add task')}
          >
            + New Task
          </Button>
        </div>

        <KanbanBoard
          id="project-kanban"
          columns={initialColumns}
          onCardMove={(cardId, fromColumn, toColumn) => {
            console.log(`Moved ${cardId} from ${fromColumn} to ${toColumn}`);
            Toast.success('Task moved!');
          }}
          onCardClick={(card) => setSelectedTask(card)}
        />
      </div>

      {selectedTask && (
        <Modal
          id="task-detail-modal"
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          title="Task Details"
        >
          <DetailView
            id="task-detail"
            data={selectedTask}
            sections={[
              {
                title: 'Task Information',
                fields: [
                  { label: 'Title', value: selectedTask.title },
                  { label: 'Description', value: selectedTask.description },
                  { label: 'Assignee', value: selectedTask.assignee },
                ],
              },
            ]}
            onEdit={() => console.log('Edit task')}
            onDelete={() => {
              console.log('Delete task');
              setSelectedTask(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
}

// ========== E-COMMERCE DEMO ==========
function ECommerceDemo() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const products = [
    {
      id: '1',
      title: 'Wireless Headphones',
      description: 'Premium sound quality',
      price: '$199',
      image: '🎧',
      rating: 4.5,
    },
    {
      id: '2',
      title: 'Smart Watch',
      description: 'Fitness tracking',
      price: '$299',
      image: '⌚',
      rating: 4.8,
    },
    {
      id: '3',
      title: 'Laptop Stand',
      description: 'Ergonomic design',
      price: '$49',
      image: '💻',
      rating: 4.3,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        id="shop-nav"
        logo="🛍️ TechStore"
        links={[
          { id: 'shop', label: 'Shop', href: '#' },
          { id: 'deals', label: 'Deals', href: '#' },
          { id: 'about', label: 'About', href: '#' },
        ]}
        actions={[
          { id: 'cart', label: '🛒 Cart (0)', onClick: () => console.log('Cart') },
        ]}
      />

      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Featured Products</h1>

        <CardGrid
          id="products-grid"
          items={products}
          columns={3}
          renderCard={(product) => (
            <div className="text-center">
              <div className="text-6xl mb-4">{product.image}</div>
              <h3 className="font-semibold">{product.title}</h3>
              <p className="text-sm text-gray-600">{product.description}</p>
              <p className="text-xl font-bold mt-2">{product.price}</p>
              <Button
                id={`buy-${product.id}`}
                variant="primary"
                size="sm"
                onClick={() => {
                  Toast.success('Added to cart!');
                }}
                className="mt-4"
              >
                Add to Cart
              </Button>
            </div>
          )}
          onItemClick={(product) => setSelectedProduct(product)}
        />
      </div>
    </div>
  );
}

// ========== ADMIN DASHBOARD DEMO ==========
function AdminDashboardDemo() {
  const users = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Active' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
  ];

  const settings = [
    {
      id: 'notifications',
      label: 'Email Notifications',
      description: 'Receive email updates',
      type: 'toggle' as const,
      value: true,
    },
    {
      id: 'theme',
      label: 'Theme',
      description: 'Choose your interface theme',
      type: 'select' as const,
      value: 'light',
      options: [
        { value: 'light', label: 'Light' },
        { value: 'dark', label: 'Dark' },
        { value: 'auto', label: 'Auto' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <DataTable
            id="users-table"
            columns={[
              { key: 'name', label: 'Name', sortable: true },
              { key: 'email', label: 'Email', sortable: true },
              { key: 'role', label: 'Role', filterable: true },
              { key: 'status', label: 'Status', filterable: true },
            ]}
            data={users}
            pagination={{ pageSize: 10, currentPage: 1, total: users.length }}
            onPageChange={(page) => console.log('Page:', page)}
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">System Settings</h2>
          <SettingsPanel
            id="system-settings"
            title="Configuration"
            settings={settings}
            onSettingChange={(id, value) => console.log('Setting changed:', id, value)}
            onSave={() => Toast.success('Settings saved!')}
          />
        </div>
      </div>
    </div>
  );
}

export default function DemosPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-8">Demo Scenarios</h1>
      <p className="text-gray-600">Component demonstrations are available in development mode.</p>
    </div>
  );
}
