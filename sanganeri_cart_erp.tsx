import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, User, Phone, Tag, Plus, Trash2, Send, Save, 
  FileText, CheckCircle, Calculator, Database, Download, 
  LayoutDashboard, ShoppingCart, Users, Settings, LogOut, Package,
  AlertCircle, Activity, Box, Layers, Menu, X, ChevronDown, Printer, Lock, Shield, UserPlus, Key, ClipboardList, Edit, UserCheck, Truck, UserCircle, AlertOctagon, FileUp, FileCheck, Filter, FilterX, Car, Clock, CheckSquare, Zap, Target, FileQuestion
} from 'lucide-react';

// --- MOCK DATABASE ---
const MOCK_CUSTOMERS = [
  { id: 'CUST-001', name: 'Rajesh Traders', phone: '9876543210', address: '12 Main Bazaar, Jaipur', kycType: 'GST', kycNumber: '08AABCR1234G1Z2', kycSigned: 'Yes', rateList: 'Base_Price', discount: 2, customerType: 'Wholesaler', paymentDays: 30, transport: 'Navkar Logistics', agentName: 'Agent Rahul', salesPerson: 'Amit Kumar', crm: 'Pooja', status: 'Working', statusRemark: '' },
  { id: 'CUST-002', name: 'M/S Sharma Cloth', phone: '9123456789', address: 'Johari Bazar, Jaipur', kycType: 'PAN', kycNumber: 'ABCDE1234F', kycSigned: 'No', rateList: 'Wholesale_7', discount: 5, customerType: 'Retailer', paymentDays: 15, transport: 'VRL Logistics', agentName: 'Direct', salesPerson: 'Ravi Singh', crm: 'Neha', status: 'Not Working', statusRemark: 'Payment default issues' },
  { id: 'CUST-003', name: 'Jaipur Texmart', phone: '9988776655', address: 'Sitapura Industrial Area', kycType: 'Aadhar', kycNumber: '1234 5678 9012', kycSigned: 'Yes', rateList: 'Base_Price', discount: 0, customerType: 'Distributor', paymentDays: 45, transport: 'TCI Freight', agentName: 'Agent Manish', salesPerson: 'Amit Kumar', crm: 'Pooja', status: 'Working', statusRemark: '' },
];

const MOCK_ITEMS = [
  { id: 'ITM-001', category: 'SINGLE BEDSHEET', size: '63x90 (2+2)', design: 'MARBAL', rates: { 'Base_Price': 505, 'Wholesale_7': 470, 'Super_15': 430 } },
  { id: 'ITM-002', category: 'SINGLE BEDSHEET', size: '70x100 (1+2)', design: 'JANTAR MANTAR (V)', rates: { 'Base_Price': 295, 'Wholesale_7': 275, 'Super_15': 250 } },
];

// --- CUSTOM SEARCHABLE DROPDOWN COMPONENT ---
const SearchableItemSelect = ({ items, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selectedItem = items.find(i => i.id === value);
  const displayText = selectedItem ? `${selectedItem.design} (${selectedItem.size})` : '-- Select Item --';

  const filteredItems = items.filter(i => {
    const searchStr = `${i.category} ${i.size} ${i.design} ${i.id}`.toLowerCase();
    return searchStr.includes(search.toLowerCase());
  });

  return (
    <div className="relative w-full">
      <div
        className="w-full bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded focus:ring-1 focus:ring-[#e74c3c] focus:border-[#e74c3c] block p-2 outline-none cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate pr-2">{displayText}</span>
        <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setIsOpen(false)} />
          <div className="absolute z-30 w-full min-w-[250px] mt-1 bg-white border border-gray-200 rounded-md shadow-xl flex flex-col left-0">
            <div className="sticky top-0 bg-white p-2 border-b border-gray-100 z-10 rounded-t-md">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-2 top-2.5" />
                <input autoFocus placeholder="Search design, size..." className="w-full pl-8 pr-2 py-1.5 bg-gray-50 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#e74c3c]" value={search} onChange={(e) => setSearch(e.target.value.toUpperCase())} />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto max-h-48">
              {filteredItems.map(item => (
                <div key={item.id} className="p-2 hover:bg-red-50 cursor-pointer text-sm border-b border-gray-50 last:border-0 transition-colors" onClick={() => { onChange(item.id); setIsOpen(false); setSearch(''); }}>
                  <div className="font-bold text-gray-800 truncate">{item.design}</div>
                  <div className="text-[10px] text-gray-500 font-mono mt-0.5"><span className="font-semibold text-indigo-500">{item.category}</span> • {item.size}</div>
                </div>
              ))}
              {filteredItems.length === 0 && <div className="p-3 text-sm text-center text-gray-500">No items found</div>}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default function App() {
  // --- AUTH & USER STATE ---
  const [users, setUsers] = useState([
    { id: 'ADMIN', password: '123', name: 'SYSTEM ADMIN', roles: ['admin'] },
    { id: 'CRM1', password: '123', name: 'CRM POOJA', roles: ['crm'] },
    { id: 'OP1', password: '123', name: 'OP TEAM 1', roles: ['op'] },
    { id: 'OP2', password: '123', name: 'OP TEAM 2', roles: ['op'] },
    { id: 'HR1', password: '123', name: 'HR DEPT', roles: ['hr'] },
    { id: 'ACC1', password: '123', name: 'ACCOUNTANT SHYAM', roles: ['accounts'] },
    { id: 'DISP1', password: '123', name: 'DISPATCH TEAM', roles: ['dispatch'] },
  ]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [newUserName, setNewUserName] = useState('');
  const [newUserId, setNewUserId] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRoles, setNewUserRoles] = useState([]);

  // --- WORKFLOW / TASK MANAGEMENT STATE ---
  const [delegations, setDelegations] = useState([
    { id: 'DEL-001', title: 'Hire new Area Sales Manager (ASM)', description: 'Post job on LinkedIn and screen 10 candidates by next week.', assignedToDept: 'hr', assignedToUser: 'HR1', status: 'Pending', createdAt: Date.now(), assignedBy: 'SYSTEM ADMIN', deadline: Date.now() + 86400000 },
  ]);
  
  const [checklists, setChecklists] = useState([
    { id: 'CHK-001', title: 'File GSTR-3B', assignedToDept: 'accounts', assignedToUser: 'ADMIN', frequency: 'Monthly', monthlyDay: '20th of the month', startDate: new Date().toISOString().split('T')[0], status: 'Pending' },
  ]);

  const [flowchartTasks, setFlowchartTasks] = useState([]);

  // Form Masters State
  const [formMasters, setFormMasters] = useState([
    { id: 'FORM-001', title: 'Dispatch QC & Logistics Details', fields: [{ id: 'f1', label: 'Number of Bales Packed', type: 'Number' }, { id: 'f2', label: 'Driver ID / Name', type: 'Text' }, { id: 'f3', label: 'Packer ID / Name', type: 'Text' }] }
  ]);
  const [newFormMaster, setNewFormMaster] = useState({ title: '', fields: [{ id: Date.now().toString(), label: '', type: 'Text' }] });

  // Dynamic Pipeline Engine State
  const [pipelines, setPipelines] = useState([
    {
      id: 'PIPE-DEFAULT',
      name: 'Standard Sales Fulfillment',
      trigger: 'Order Generation (Default)',
      roundRobinState: {}, 
      steps: [
        { id: 'step-1', title: 'Pick & Pack Order', assignedToDept: 'op', assignedToUser: 'ROUND_ROBIN', how: 'Verify items from rack, quality check, and pack securely in standard boxes.', tatMinutes: 30, requiresChecklist: false, checklistItems: [], requiresForm: false, attachedFormId: '' },
        { id: 'step-2', title: 'Logistics Dispatch', assignedToDept: 'dispatch', assignedToUser: 'ROUND_ROBIN', how: 'Assign transport partner, generate e-way bill, and hand over to driver. Ensure to fill the tracking form below!', tatMinutes: 60, requiresChecklist: false, checklistItems: [], requiresForm: true, attachedFormId: 'FORM-001' },
        { id: 'step-3', title: 'Final Invoice Billing', assignedToDept: 'accounts', assignedToUser: 'ROUND_ROBIN', how: 'Generate final GST invoice in accounting software and send soft copy to customer via WhatsApp.', tatMinutes: 120, requiresChecklist: true, checklistItems: ['Check address on GST Portal', 'Verify NO previous bills are due'], requiresForm: false, attachedFormId: '' }
      ]
    }
  ]);
  const [showPipelineBuilder, setShowPipelineBuilder] = useState(false);
  const [editingPipelineId, setEditingPipelineId] = useState(null);
  const [newPipeline, setNewPipeline] = useState({
    name: '', trigger: 'Manual', steps: [{ id: Date.now().toString(), title: '', assignedToDept: 'crm', assignedToUser: 'ROUND_ROBIN', how: '', tatMinutes: 60, requiresChecklist: false, checklistItems: [''], requiresForm: false, attachedFormId: '' }]
  });

  // --- DISPATCH LOGIC STATE ---
  const [dispatchRecords, setDispatchRecords] = useState([]);
  const [dispatchForm, setDispatchForm] = useState({ orderNo: '', bales: 1, driverId: '', packerId: '' });
  const [newPackerName, setNewPackerName] = useState('');

  // --- CORE ERP STATE ---
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [expandedDept, setExpandedDept] = useState(''); 
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
  const [items, setItems] = useState(MOCK_ITEMS);
  const [savedOrders, setSavedOrders] = useState([]);
  
  // --- SETTINGS MASTER STATE ---
  const [masterSettings, setMasterSettings] = useState({
    customerTypes: ['WHOLESALER', 'RETAILER', 'DISTRIBUTOR', 'BOUTIQUE/RESELLER', 'END CONSUMER'],
    drivers: [{ id: 'DRV-001', name: 'RAMESH', contact: '9822012345' }],
    packers: [{ id: 'PCK-001', name: 'RAMU PACKER' }], 
    transports: [{ id: 'TRP-001', name: 'NAVKAR LOGISTICS', gstNo: '08AABCT1234Z1', contact: '9822012345', driverName: 'RAMESH', pickupSlot: 'MORNING' }],
    agents: ['DIRECT', 'AGENT RAHUL', 'AGENT MANISH'],
    salesPersons: ['AMIT KUMAR', 'RAVI SINGH'],
    crms: ['POOJA', 'NEHA'],
    roles: [
      { id: 'admin', label: 'System Admin (Full Access)' },
      { id: 'crm', label: 'CRM Department' },
      { id: 'sales', label: 'Sales Department' },
      { id: 'dispatch', label: 'Dispatch Department' },
      { id: 'op', label: 'Order Processing (OP)' },
      { id: 'hr', label: 'HR Department' },
      { id: 'mdo', label: 'MDO Department' },
      { id: 'purchase', label: 'Purchase Department' },
      { id: 'accounts', label: 'Accounts' },
      { id: 'catalog', label: 'Catalog' }
    ],
    customizationTypes: ['LOGO PRINTING', 'SPECIAL PACKAGING', 'CUSTOM SIZES']
  });
  const [settingInputs, setSettingInputs] = useState({ customerTypes: '', agents: '', salesPersons: '', crms: '', customizationTypes: '' });
  const [newDriver, setNewDriver] = useState({ name: '', contact: '' });
  const [newTransport, setNewTransport] = useState({ name: '', gstNo: '', contact: '', driverName: '', pickupSlot: '' });

  // --- ONBOARDING FORM STATE ---
  const [editingCustomerId, setEditingCustomerId] = useState(null); 
  const [onboardingForm, setOnboardingForm] = useState({
    name: '', mobile1: '', mobile2: '', mobile3: '', kycType: 'GST', kycNumber: '', kycSigned: 'No', kycFileName: '', chequeFileName: '', idPhotoFileName: '',
    rateList: '', agentName: '', discount: '', address: '', city: '', state: '', remarks: '', salesPerson: '', crm: '', whatsappGroup: 'Yes', personalGroup: 'No', paymentDays: '',
    transport: '', customerType: '', status: 'Working', statusRemark: ''
  });

  // --- NEW WORKFLOW CREATION STATE (MDO) ---
  const [newDelegation, setNewDelegation] = useState({ title: '', description: '', assignedToDept: 'hr', assignedToUser: '', deadline: '' });
  const [newChecklist, setNewChecklist] = useState({ title: '', frequency: 'Daily', assignedToDept: 'accounts', assignedToUser: '', startDate: '', monthlyDay: 'Start of the month' });
  const [rescheduleData, setRescheduleData] = useState({ id: null, newDeadline: '' });
  const [mdoWorkflowTab, setMdoWorkflowTab] = useState('delegation'); 
  const [checklistFilterDept, setChecklistFilterDept] = useState(''); 
  const [checklistFilterUser, setChecklistFilterUser] = useState('');
  const [checklistFilterDate, setChecklistFilterDate] = useState('');

  // --- ORDER FORM STATE ---
  const [searchTerm, setSearchTerm] = useState('');
  const [customerSearchTerm, setCustomerSearchTerm] = useState(''); 
  const [showFilters, setShowFilters] = useState(false);
  const [customerFilters, setCustomerFilters] = useState({ agentName: '', rateList: '', customerType: '', status: '', state: '', city: '', crm: '' });
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [orderLines, setOrderLines] = useState([]);
  const [packingCharges, setPackingCharges] = useState(0);
  const [customizationCharges, setCustomizationCharges] = useState(0);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notification, setNotification] = useState('');
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, message: '', onConfirm: null }); 
  const [orderTransport, setOrderTransport] = useState(''); 
  const [ccAttached, setCcAttached] = useState('No'); 
  const [globalCustomization, setGlobalCustomization] = useState('No');
  const [globalCustomizationType, setGlobalCustomizationType] = useState('');

  // Real-time clock for TAT tracking
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 60000); // update every min
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const availableRateLists = useMemo(() => {
    if (items.length === 0) return [];
    return Object.keys(items[0].rates || {});
  }, [items]);

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const lowerTerm = searchTerm.toLowerCase();
    return customers.filter(c => 
      c.name.toLowerCase().includes(lowerTerm) || c.phone.includes(lowerTerm) || c.id.toLowerCase().includes(lowerTerm) ||
      (c.kycNumber && c.kycNumber.toLowerCase().includes(lowerTerm)) || (c.gstNo && c.gstNo.toLowerCase().includes(lowerTerm))
    );
  }, [searchTerm, customers]);

  const filteredCustomerMaster = useMemo(() => {
    return customers.filter(c => {
      const matchesSearch = !customerSearchTerm.trim() || 
        c.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) || c.phone.includes(customerSearchTerm.toLowerCase()) || c.id.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
        (c.kycNumber && c.kycNumber.toLowerCase().includes(customerSearchTerm.toLowerCase())) || (c.gstNo && c.gstNo.toLowerCase().includes(customerSearchTerm.toLowerCase()));
      const matchesAgent = !customerFilters.agentName || c.agentName === customerFilters.agentName;
      const matchesRateList = !customerFilters.rateList || c.rateList === customerFilters.rateList;
      const matchesType = !customerFilters.customerType || c.customerType === customerFilters.customerType;
      const matchesStatus = !customerFilters.status || c.status === customerFilters.status;
      const matchesCrm = !customerFilters.crm || c.crm === customerFilters.crm;
      const matchesState = !customerFilters.state || (c.state && c.state.toUpperCase().includes(customerFilters.state.toUpperCase()));
      const matchesCity = !customerFilters.city || (c.city && c.city.toUpperCase().includes(customerFilters.city.toUpperCase()));
      return matchesSearch && matchesAgent && matchesRateList && matchesType && matchesStatus && matchesCrm && matchesState && matchesCity;
    });
  }, [customerSearchTerm, customerFilters, customers]);

  const filteredChecklistsOverview = useMemo(() => {
    return checklists.filter(c => {
      const matchDept = !checklistFilterDept || c.assignedToDept === checklistFilterDept;
      const matchUser = !checklistFilterUser || c.assignedToUser === checklistFilterUser;
      let matchDate = true;

      if (checklistFilterDate) {
        const target = new Date(checklistFilterDate);
        const start = new Date(c.startDate);
        
        target.setHours(0, 0, 0, 0);
        start.setHours(0, 0, 0, 0);

        if (target < start) {
          matchDate = false; 
        } else {
          if (c.frequency === 'Daily') {
            matchDate = true;
          } else if (c.frequency === 'Weekly') {
            matchDate = target.getDay() === start.getDay();
          } else if (c.frequency === 'Fortnightly') {
            const diffTime = target.getTime() - start.getTime();
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
            matchDate = diffDays % 14 === 0;
          } else if (c.frequency === 'Monthly') {
            if (c.monthlyDay === 'Start of the month') {
              matchDate = target.getDate() === 1;
            } else if (c.monthlyDay === 'End of the month') {
              const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
              matchDate = target.getDate() === lastDay;
            } else {
              const day = parseInt(c.monthlyDay, 10);
              matchDate = target.getDate() === day;
            }
          } else if (c.frequency === 'Quarterly') {
            const monthDiff = (target.getFullYear() - start.getFullYear()) * 12 + (target.getMonth() - start.getMonth());
            matchDate = (monthDiff % 3 === 0) && (target.getDate() === start.getDate());
          } else if (c.frequency === 'Half Yearly') {
            const monthDiff = (target.getFullYear() - start.getFullYear()) * 12 + (target.getMonth() - start.getMonth());
            matchDate = (monthDiff % 6 === 0) && (target.getDate() === start.getDate());
          } else if (c.frequency === 'Yearly') {
            matchDate = target.getMonth() === start.getMonth() && target.getDate() === start.getDate();
          } else {
            matchDate = false;
          }
        }
      }

      return matchDept && matchUser && matchDate;
    });
  }, [checklists, checklistFilterDept, checklistFilterUser, checklistFilterDate]);

  const currentOrderDisplayNo = editingOrderId || `ORD-${(savedOrders.length + 1).toString().padStart(4, '0')}`;

  // --- Department Navigation Structure ---
  const DEPARTMENTS = [
    {
      id: 'dashboard', name: 'MY DASHBOARD', icon: Target, roles: ['admin', 'crm', 'sales', 'dispatch', 'op', 'hr', 'mdo', 'purchase', 'accounts', 'catalog'],
      items: [
        { tab: 'dashboard', label: 'My Daily Workflow', icon: Zap }
      ]
    },
    {
      id: 'crm', name: 'CRM', icon: Users, roles: ['admin', 'crm'],
      items: [
        { tab: 'order', label: 'Order Form Generate', icon: LayoutDashboard },
        { tab: 'onboarding', label: 'Customer Onboarding', icon: UserCheck },
        { tab: 'history', label: 'Order Master', icon: ClipboardList },
        { tab: 'customers', label: 'CRM Master Data', icon: Users },
        { tab: 'rates', label: 'Rate List', icon: Package }
      ]
    },
    { id: 'sales', name: 'SALES', icon: Activity, roles: ['admin', 'sales'], items: [] },
    { id: 'dispatch', name: 'DISPATCH', icon: Truck, roles: ['admin', 'dispatch'], items: [
      { tab: 'dispatch_ops', label: 'Daily Dispatch (Bales)', icon: Package },
      { tab: 'transport_master', label: 'Transport & Drivers', icon: Truck }
    ] },
    { id: 'op', name: 'ORDER PROCESSING', icon: Layers, roles: ['admin', 'op'], items: [] },
    { id: 'hr', name: 'HR', icon: User, roles: ['admin', 'hr'], items: [] },
    {
      id: 'mdo', name: 'MDO', icon: Settings, roles: ['admin', 'mdo'],
      items: [
        { tab: 'workflow_builder', label: 'Workflow & Task Builder', icon: CheckSquare },
        { tab: 'users', label: 'Staff Management', icon: Shield },
        { tab: 'settings', label: 'Master Settings', icon: Settings }
      ]
    },
    { id: 'purchase', name: 'PURCHASE', icon: ShoppingCart, roles: ['admin', 'purchase'], items: [] },
    { id: 'accounts', name: 'ACCOUNTS', icon: Calculator, roles: ['admin', 'accounts'], items: [] },
    { id: 'catalog', name: 'CATALOG', icon: Box, roles: ['admin', 'catalog'], items: [] },
  ];

  // --- TASK & WORKFLOW HANDLERS ---
  const handleCreateDelegation = (e) => {
    e.preventDefault();
    if(!newDelegation.title || !newDelegation.assignedToUser || !newDelegation.deadline) {
      setNotification('Please fill all fields, including the exact deadline.');
      return;
    }
    setDelegations([...delegations, { 
      id: `DEL-${Date.now()}`, 
      ...newDelegation,
      deadline: new Date(newDelegation.deadline).getTime(),
      status: 'Pending', 
      createdAt: Date.now(),
      assignedBy: currentUser.name 
    }]);
    setNewDelegation({ title: '', description: '', assignedToDept: 'hr', assignedToUser: '', deadline: '' });
    setNotification('Task Delegated Successfully!');
  };

  const handleReschedule = (taskId) => {
    if(!rescheduleData.newDeadline) return;
    setDelegations(delegations.map(d => d.id === taskId ? { ...d, deadline: new Date(rescheduleData.newDeadline).getTime() } : d));
    setRescheduleData({ id: null, newDeadline: '' });
    setNotification('Task deadline rescheduled successfully!');
  };

  const handleCreateChecklist = (e) => {
    e.preventDefault();
    if(!newChecklist.title || !newChecklist.assignedToUser || !newChecklist.startDate) {
      setNotification('Please fill all required checklist fields.');
      return;
    }
    setChecklists([...checklists, { 
      id: `CHK-${Date.now()}`, 
      ...newChecklist, 
      status: 'Pending' 
    }]);
    setNewChecklist({ title: '', frequency: 'Daily', assignedToDept: 'accounts', assignedToUser: '', startDate: '', monthlyDay: 'Start of the month' });
    setNotification('Checklist Item Created!');
  };

  const completeTask = (type, id) => {
    if (type === 'delegation') {
      setDelegations(delegations.map(d => d.id === id ? {...d, status: 'Completed'} : d));
      setNotification('Delegation marked as complete!');
    } else if (type === 'checklist') {
      setChecklists(checklists.map(c => c.id === id ? {...c, status: 'Completed'} : c));
      setNotification('Checklist item completed!');
    }
  };

  const handleSaveFormMaster = (e) => {
    e.preventDefault();
    if (!newFormMaster.title.trim() || newFormMaster.fields.some(f => !f.label.trim())) {
      setNotification('Please fill the form title and all field labels.');
      return;
    }
    setFormMasters([...formMasters, { ...newFormMaster, id: `FORM-${Date.now()}` }]);
    setNewFormMaster({ title: '', fields: [{ id: Date.now().toString(), label: '', type: 'Text' }] });
    setNotification('Form Master Created Successfully!');
  };

  const handleDeleteFormMaster = (id) => {
    setConfirmDialog({
      isOpen: true,
      message: 'Delete this Form Master? Any flowcharts using this form will lose the attachment.',
      onConfirm: () => {
        setFormMasters(formMasters.filter(f => f.id !== id));
        setNotification('Form Master deleted.');
      }
    });
  };

  const handleDeleteDelegation = (id) => {
    setConfirmDialog({
      isOpen: true,
      message: 'Are you sure you want to permanently delete this delegation task?',
      onConfirm: () => {
        setDelegations(delegations.filter(d => d.id !== id));
        setNotification('Delegation deleted.');
      }
    });
  };

  const handleDeleteChecklist = (id) => {
    setConfirmDialog({
      isOpen: true,
      message: 'Are you sure you want to permanently delete this routine checklist item?',
      onConfirm: () => {
        setChecklists(checklists.filter(c => c.id !== id));
        setNotification('Checklist item deleted.');
      }
    });
  };

  // --- ROUND ROBIN PIPELINE HELPER ---
  const resolveRRUser = (pipeline, step) => {
    if (step.assignedToUser !== 'ROUND_ROBIN') return { userId: step.assignedToUser, newRRState: null };
    
    // Find eligible users in that department
    const eligible = users.filter(u => u.roles.includes(step.assignedToDept));
    if (eligible.length === 0) return { userId: 'UNASSIGNED', newRRState: null };
    
    // Determine who is next
    const currentIndex = pipeline.roundRobinState?.[step.id] || 0;
    const nextIndex = (currentIndex + 1) % eligible.length;
    
    return { userId: eligible[currentIndex].id, newRRState: nextIndex };
  };

  const handleFlowchartFormInput = (taskId, fieldId, value) => {
    setFlowchartTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      return { ...t, formAnswers: { ...(t.formAnswers || {}), [fieldId]: value } };
    }));
  };

  const progressFlowchart = (taskId) => {
    const task = flowchartTasks.find(t => t.id === taskId);
    if (!task) return;

    const pipeline = pipelines.find(p => p.id === task.pipelineId);
    if (!pipeline) { 
       setFlowchartTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'Completed', stage: 'completed', assignedToDept: 'none', assignedToUser: 'none' } : t));
       return; 
    }

    // *** AUTOMATIC DISPATCH INTEGRATION ***
    // If the task completing was a 'dispatch' task, automatically harvest its form fields and save to the Dispatch Log!
    if (task.stage === 'dispatch' && task.formAnswers && task.attachedFormId) {
      const dspNo = `DSP-${String(dispatchRecords.length + 1).padStart(4, '0')}`;
      let extractedBales = 1;
      let extractedDriverId = '';
      let extractedPackerId = '';
      
      const formMaster = formMasters.find(fm => fm.id === task.attachedFormId);
      if (formMaster) {
        formMaster.fields.forEach(field => {
          const label = field.label.toLowerCase();
          const answer = task.formAnswers[field.id];
          if (!answer) return;

          // Smart keyword matching for automation
          if (label.includes('bale')) extractedBales = parseInt(answer) || 1;
          
          if (label.includes('driver')) {
             const foundDriver = masterSettings.drivers.find(d => d.name.toLowerCase() === String(answer).toLowerCase() || d.id === answer);
             extractedDriverId = foundDriver ? foundDriver.id : String(answer);
          }
          
          if (label.includes('packer')) {
             const foundPacker = masterSettings.packers.find(p => p.name.toLowerCase() === String(answer).toLowerCase() || p.id === answer);
             extractedPackerId = foundPacker ? foundPacker.id : String(answer);
          }
        });
      }

      // Save to Dispatch Master automatically!
      setDispatchRecords(prev => [{
        id: dspNo,
        date: new Date().toISOString(),
        orderNo: task.contextData?.orderNo || 'AUTO-OP',
        driverId: extractedDriverId,
        packerId: extractedPackerId,
        bales: extractedBales,
        createdBy: currentUser.name
      }, ...prev]);
    }

    // Progress to next step...
    const nextIndex = task.currentStepIndex + 1;
    
    if (nextIndex < pipeline.steps.length) {
      const nextStep = pipeline.steps[nextIndex];
      const { userId, newRRState } = resolveRRUser(pipeline, nextStep);

      // Mutate RR state safely
      if (newRRState !== null) {
         setPipelines(prev => prev.map(p => p.id === pipeline.id ? { ...p, roundRobinState: { ...(p.roundRobinState||{}), [nextStep.id]: newRRState } } : p));
      }

      setFlowchartTasks(prevTasks => prevTasks.map(t => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          title: nextStep.title,
          stage: nextStep.assignedToDept,
          assignedToDept: nextStep.assignedToDept,
          assignedToUser: userId,
          startTime: Date.now(),
          tatMinutes: nextStep.tatMinutes,
          details: `Ref: ${t.contextData?.orderNo || 'Manual Pipeline'}. Instructions: ${nextStep.how}`,
          currentStepIndex: nextIndex,
          checklist: nextStep.requiresChecklist ? nextStep.checklistItems.map(text => ({ text, isCompleted: false })) : [],
          attachedFormId: nextStep.requiresForm ? nextStep.attachedFormId : '',
          formAnswers: {} // reset answers for the new step
        };
      }));

      const assignedDeptName = masterSettings.roles.find(r=>r.id===nextStep.assignedToDept)?.label || nextStep.assignedToDept;
      const assignedUserName = users.find(u=>u.id===userId)?.name || userId;
      setNotification(`Task completed! Handed over to ${assignedUserName} (${assignedDeptName}).`);
    } else {
      setFlowchartTasks(prevTasks => prevTasks.map(t => t.id === taskId ? { ...t, stage: 'completed', assignedToDept: 'none', assignedToUser: 'none', status: 'Completed', details: 'All stages completed successfully.' } : t));
      setNotification(`Pipeline "${pipeline.name}" is fully complete!`);
    }
  };

  const toggleFlowchartChecklist = (taskId, index) => {
    setFlowchartTasks(prev => prev.map(t => {
      if (t.id !== taskId) return t;
      const newChecklist = [...t.checklist];
      newChecklist[index].isCompleted = !newChecklist[index].isCompleted;
      return { ...t, checklist: newChecklist };
    }));
  };

  // --- DYNAMIC PIPELINE BUILDER HANDLERS ---
  const handleEditPipeline = (pipeline) => {
    const deepCopiedSteps = JSON.parse(JSON.stringify(pipeline.steps));
    setNewPipeline({
      name: pipeline.name,
      trigger: pipeline.trigger,
      steps: deepCopiedSteps
    });
    setEditingPipelineId(pipeline.id);
    setShowPipelineBuilder(true);
  };

  const handleDeletePipeline = (id) => {
    setConfirmDialog({
      isOpen: true,
      message: 'Are you sure you want to permanently delete this flowchart pipeline?',
      onConfirm: () => {
        setPipelines(pipelines.filter(p => p.id !== id));
        setNotification('Flowchart pipeline deleted.');
      }
    });
  };

  const handleAddPipelineStep = () => {
    setNewPipeline(prev => ({
      ...prev,
      steps: [...prev.steps, { id: Date.now().toString(), title: '', assignedToDept: 'crm', assignedToUser: 'ROUND_ROBIN', how: '', tatMinutes: 60, requiresChecklist: false, checklistItems: [''], requiresForm: false, attachedFormId: '' }]
    }));
  };

  const handleRemovePipelineStep = (stepId) => {
    if (newPipeline.steps.length === 1) {
      setNotification('A flowchart must have at least one step.');
      return;
    }
    setNewPipeline(prev => ({
      ...prev,
      steps: prev.steps.filter(s => s.id !== stepId)
    }));
  };

  const handleUpdatePipelineStep = (stepId, field, value) => {
    setNewPipeline(prev => ({
      ...prev,
      steps: prev.steps.map(s => s.id === stepId ? { ...s, [field]: value } : s)
    }));
  };

  const handleSavePipeline = (e) => {
    e.preventDefault();
    // Validation
    const isInvalid = newPipeline.steps.some(s => {
      if (!s.title.trim() || !s.assignedToUser || !s.how.trim() || s.tatMinutes < 1) return true;
      if (s.requiresChecklist && (s.checklistItems.length === 0 || s.checklistItems.some(i => !i.trim()))) return true;
      if (s.requiresForm && !s.attachedFormId) return true;
      return false;
    });

    if (!newPipeline.name.trim() || isInvalid) {
      setNotification('Please fill all fields. Ensure checklists or forms are fully configured if required.');
      return;
    }

    if (editingPipelineId) {
      setPipelines(pipelines.map(p => p.id === editingPipelineId ? { ...newPipeline, id: editingPipelineId, roundRobinState: p.roundRobinState || {} } : p));
      setNotification('Flowchart Pipeline updated successfully!');
    } else {
      setPipelines([...pipelines, { ...newPipeline, id: `PIPE-${Date.now()}`, roundRobinState: {} }]);
      setNotification('New Flowchart Pipeline created successfully!');
    }
    
    setShowPipelineBuilder(false);
    setEditingPipelineId(null);
    setNewPipeline({ name: '', trigger: 'Manual', steps: [{ id: Date.now().toString(), title: '', assignedToDept: 'crm', assignedToUser: 'ROUND_ROBIN', how: '', tatMinutes: 60, requiresChecklist: false, checklistItems: [''], requiresForm: false, attachedFormId: '' }] });
  };

  const handleTriggerManualPipeline = (pipelineId) => {
    const pipeline = pipelines.find(p => p.id === pipelineId);
    if (!pipeline || pipeline.steps.length === 0) return;

    const firstStep = pipeline.steps[0];
    const { userId, newRRState } = resolveRRUser(pipeline, firstStep);

    if (newRRState !== null) {
       setPipelines(prev => prev.map(p => p.id === pipeline.id ? { ...p, roundRobinState: { ...(p.roundRobinState||{}), [firstStep.id]: newRRState } } : p));
    }

    setFlowchartTasks(prev => [...prev, {
      id: `FLW-${Date.now()}`,
      title: firstStep.title,
      customerName: 'Internal Task',
      stage: firstStep.assignedToDept,
      assignedToDept: firstStep.assignedToDept,
      assignedToUser: userId,
      startTime: Date.now(),
      tatMinutes: firstStep.tatMinutes,
      status: 'Pending',
      details: `Instructions: ${firstStep.how}`,
      pipelineId: pipeline.id,
      currentStepIndex: 0,
      contextData: { orderNo: 'Manual Trigger' },
      checklist: firstStep.requiresChecklist ? firstStep.checklistItems.map(text => ({ text, isCompleted: false })) : [],
      attachedFormId: firstStep.requiresForm ? firstStep.attachedFormId : '',
      formAnswers: {}
    }]);
    setNotification(`Manually triggered pipeline: ${pipeline.name}`);
  };

  const formatTAT = (startTime, allowedMinutes) => {
    const elapsed = (currentTime - startTime) / 60000;
    const remaining = allowedMinutes - elapsed;
    if (remaining < 0) return <span className="text-red-600 font-bold bg-red-100 px-2 py-1 rounded text-xs animate-pulse">OVERDUE BY {Math.abs(Math.round(remaining))} MINS</span>;
    if (remaining < 15) return <span className="text-orange-600 font-bold bg-orange-100 px-2 py-1 rounded text-xs">{Math.round(remaining)} mins left</span>;
    return <span className="text-green-600 font-bold bg-green-100 px-2 py-1 rounded text-xs">{Math.round(remaining)} mins left</span>;
  };


  // --- SETTINGS MASTER HANDLERS ---
  const handleAddSetting = (category) => {
    const val = settingInputs[category].trim();
    if (!val) return;
    if (masterSettings[category].includes(val)) { setNotification('This value already exists!'); return; }
    setMasterSettings({ ...masterSettings, [category]: [...masterSettings[category], val] });
    setSettingInputs({ ...settingInputs, [category]: '' });
    setNotification('Added to master list!');
  };

  const handleRemoveSetting = (category, val) => {
    setMasterSettings({ ...masterSettings, [category]: masterSettings[category].filter(item => item !== val) });
    setNotification('Removed from master list.');
  };

  const handleAddDriver = () => {
    if (!newDriver.name.trim() || !newDriver.contact.trim()) return;
    const newId = `DRV-${String(masterSettings.drivers.length + 1).padStart(3, '0')}`;
    setMasterSettings({ ...masterSettings, drivers: [...masterSettings.drivers, { id: newId, name: newDriver.name.trim().toUpperCase(), contact: newDriver.contact.trim().toUpperCase() }] });
    setNewDriver({ name: '', contact: '' });
    setNotification('Driver added successfully!');
  };

  const handleRemoveDriver = (id) => {
    setMasterSettings({ ...masterSettings, drivers: masterSettings.drivers.filter(d => d.id !== id) });
    setNotification('Driver removed.');
  };

  const handleAddTransport = () => {
    if (!newTransport.name.trim()) return;
    const newId = `TRP-${String(masterSettings.transports.length + 1).padStart(3, '0')}`;
    setMasterSettings({ ...masterSettings, transports: [...masterSettings.transports, { id: newId, name: newTransport.name.trim().toUpperCase(), gstNo: newTransport.gstNo.trim().toUpperCase(), contact: newTransport.contact.trim().toUpperCase(), driverName: newTransport.driverName.trim().toUpperCase(), pickupSlot: newTransport.pickupSlot.trim().toUpperCase() }] });
    setNewTransport({ name: '', gstNo: '', contact: '', driverName: '', pickupSlot: '' });
    setNotification('Transport added successfully!');
  };

  const handleRemoveTransport = (id) => {
    setMasterSettings({ ...masterSettings, transports: masterSettings.transports.filter(t => t.id !== id) });
  };

  // NEW: Dispatch Operations Handlers
  const handleAddPacker = () => {
    if (!newPackerName.trim()) return;
    const newId = `PCK-${String(masterSettings.packers.length + 1).padStart(3, '0')}`;
    setMasterSettings({ ...masterSettings, packers: [...masterSettings.packers, { id: newId, name: newPackerName.trim().toUpperCase() }] });
    setNewPackerName('');
    setNotification('Packer added successfully!');
  };

  const handleRemovePacker = (id) => {
    setMasterSettings({ ...masterSettings, packers: masterSettings.packers.filter(p => p.id !== id) });
    setNotification('Packer removed.');
  };

  // --- SYSTEM BACKUP & RESTORE HANDLERS ---
  const handleExportBackup = () => {
    const backupData = {
      users, customers, items, savedOrders, masterSettings,
      delegations, checklists, formMasters, pipelines,
      dispatchRecords, flowchartTasks
    };
    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sanganeri_erp_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setNotification("System Backup Downloaded Successfully!");
  };

  const handleRestoreBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setConfirmDialog({
      isOpen: true,
      message: 'WARNING: Restoring a backup will completely overwrite ALL current system data (orders, users, pipelines, etc.). Are you absolutely sure you want to proceed?',
      onConfirm: () => {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);
            // Carefully restore states if they exist in the backup
            if (data.users) setUsers(data.users);
            if (data.customers) setCustomers(data.customers);
            if (data.items) setItems(data.items);
            if (data.savedOrders) setSavedOrders(data.savedOrders);
            if (data.masterSettings) setMasterSettings(data.masterSettings);
            if (data.delegations) setDelegations(data.delegations);
            if (data.checklists) setChecklists(data.checklists);
            if (data.formMasters) setFormMasters(data.formMasters);
            if (data.pipelines) setPipelines(data.pipelines);
            if (data.dispatchRecords) setDispatchRecords(data.dispatchRecords);
            if (data.flowchartTasks) setFlowchartTasks(data.flowchartTasks);
            
            setNotification("System Restored Successfully from Backup!");
          } catch (err) {
            setNotification("Error: Invalid Backup File format.");
          }
        };
        reader.readAsText(file);
      }
    });
    e.target.value = null; // Reset input
  };

  const handleSaveDispatchRecord = (e) => {
    e.preventDefault();
    if (!dispatchForm.orderNo || !dispatchForm.driverId || !dispatchForm.packerId || dispatchForm.bales < 1) {
      setNotification('Please fill all dispatch fields.');
      return;
    }

    const dspNo = `DSP-${String(dispatchRecords.length + 1).padStart(4, '0')}`;
    const newRecord = {
      id: dspNo,
      date: new Date().toISOString(),
      orderNo: dispatchForm.orderNo,
      driverId: dispatchForm.driverId,
      packerId: dispatchForm.packerId,
      bales: parseInt(dispatchForm.bales),
      createdBy: currentUser.name
    };

    setDispatchRecords([newRecord, ...dispatchRecords]);
    setNotification(`Dispatch ${dspNo} recorded successfully!`);
    setDispatchForm({ orderNo: '', bales: 1, driverId: '', packerId: '' });
  };

  // --- CRM & ORDER HANDLERS ---
  const resetOnboardingForm = () => {
    setEditingCustomerId(null);
    setOnboardingForm({ name: '', mobile1: '', mobile2: '', mobile3: '', kycType: 'GST', kycNumber: '', kycSigned: 'No', kycFileName: '', chequeFileName: '', idPhotoFileName: '', rateList: '', agentName: '', discount: '', address: '', city: '', state: '', remarks: '', salesPerson: '', crm: '', whatsappGroup: 'Yes', personalGroup: 'No', paymentDays: '', transport: '', customerType: '', status: 'Working', statusRemark: '' });
  };

  const handleEditCustomerMaster = (customer) => {
    setEditingCustomerId(customer.id);
    setOnboardingForm({ ...customer, kycSigned: customer.kycSigned || 'No', kycType: customer.kycType || 'GST', status: customer.status || 'Working' });
    navigateTab('onboarding');
  };

  const handleOnboardingSubmit = (e) => {
    e.preventDefault();
    const customerId = editingCustomerId || `CUST-${String(customers.length + 1).padStart(3, '0')}`;
    const newCustomerData = { id: customerId, ...onboardingForm, discount: parseFloat(onboardingForm.discount) || 0, paymentDays: parseInt(onboardingForm.paymentDays) || 0 };
    if (newCustomerData.customerType === 'END CONSUMER') {
      newCustomerData.kycType = ''; newCustomerData.kycNumber = ''; newCustomerData.kycSigned = 'No'; newCustomerData.whatsappGroup = 'No'; newCustomerData.personalGroup = 'No';
    }
    if (editingCustomerId) {
      setCustomers(customers.map(c => c.id === editingCustomerId ? newCustomerData : c));
      setNotification(`Customer updated successfully!`);
    } else {
      setCustomers([newCustomerData, ...customers]);
      setNotification(`Customer onboarded successfully!`);
    }
    resetOnboardingForm();
    navigateTab('customers');
  };

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer); setSearchTerm(''); setIsSearching(false);
    if (!editingOrderId) { 
      setOrderLines([{ id: Date.now(), itemId: '', quantity: 1, rate: 0, isCustomized: 'No' }]); 
      setPackingCharges(0); 
      setCustomizationCharges(0); 
      setOrderTransport(customer.transport || ''); // Auto-fill default transport
      setCcAttached('No');
      setGlobalCustomization('No');
      setGlobalCustomizationType('');
    }
  };

  const handleClearCustomer = () => { setSelectedCustomer(null); setOrderLines([]); setPackingCharges(0); setCustomizationCharges(0); setEditingOrderId(null); setOrderTransport(''); setCcAttached('No'); setGlobalCustomization('No'); setGlobalCustomizationType(''); };
  const addOrderLine = () => { setOrderLines([...orderLines, { id: Date.now(), itemId: '', quantity: 1, rate: 0, isCustomized: 'No' }]); };
  const removeOrderLine = (id) => { setOrderLines(orderLines.filter(line => line.id !== id)); };

  const updateOrderLine = (id, field, value) => {
    setOrderLines(orderLines.map(line => {
      if (line.id !== id) return line;
      const updatedLine = { ...line, [field]: value };
      if (field === 'itemId' && selectedCustomer) {
        const item = items.find(i => i.id === value);
        updatedLine.rate = (item && item.rates) ? (item.rates[selectedCustomer.rateList] || 0) : 0;
      }
      if (field === 'quantity' && value < 1) updatedLine.quantity = 1;
      return updatedLine;
    }));
  };

  const calculations = useMemo(() => {
    const baseSubtotal = orderLines.reduce((sum, line) => sum + (line.quantity * (line.rate || 0)), 0);
    const customization = parseFloat(customizationCharges) || 0;
    const subtotalWithCustomization = baseSubtotal + customization;
    const discountPercent = selectedCustomer?.discount || 0;
    const discountAmount = subtotalWithCustomization * (discountPercent / 100);
    const packing = parseFloat(packingCharges) || 0;
    const taxableAmount = (subtotalWithCustomization - discountAmount) + packing;
    const gstAmount = taxableAmount * 0.05;
    const exactGrandTotal = taxableAmount + gstAmount;
    const grandTotal = Math.round(exactGrandTotal);
    const roundOff = grandTotal - exactGrandTotal;
    return { baseSubtotal, subtotalWithCustomization, discountPercent, discountAmount, customization, packing, taxableAmount, gstAmount, exactGrandTotal, roundOff, grandTotal };
  }, [orderLines, selectedCustomer, packingCharges, customizationCharges]);

  const handleSaveOrder = () => {
    if (!selectedCustomer || orderLines.length === 0 || !orderLines[0].itemId) return;

    const orderData = {
      orderNo: currentOrderDisplayNo, date: new Date().toISOString(), customer: selectedCustomer, lines: [...orderLines],
      packingCharges: parseFloat(packingCharges) || 0, customizationCharges: parseFloat(customizationCharges) || 0, calculations: calculations, createdBy: currentUser.name,
      transport: orderTransport, ccAttached: ccAttached, globalCustomization: globalCustomization, globalCustomizationType: globalCustomizationType
    };

    if (editingOrderId) {
      setSavedOrders(savedOrders.map(o => o.orderNo === editingOrderId ? orderData : o));
      setNotification(`Order ${editingOrderId} updated successfully!`);
    } else {
      setSavedOrders([orderData, ...savedOrders]);
      
      // *** DYNAMIC FLOWCHART INTEGRATION ***
      let expectedTrigger = 'Order Generation (Default)';
      if (globalCustomization === 'Yes' && globalCustomizationType) {
         expectedTrigger = `Order Generation (Customisation: ${globalCustomizationType})`;
      }

      const orderPipeline = pipelines.find(p => p.trigger === expectedTrigger);
      
      if (orderPipeline && orderPipeline.steps.length > 0) {
        const firstStep = orderPipeline.steps[0];
        const { userId, newRRState } = resolveRRUser(orderPipeline, firstStep);

        if (newRRState !== null) {
           setPipelines(prev => prev.map(p => p.id === orderPipeline.id ? { ...p, roundRobinState: { ...(p.roundRobinState||{}), [firstStep.id]: newRRState } } : p));
        }
        
        setFlowchartTasks(prev => [...prev, {
          id: `FLW-${Date.now()}`,
          title: firstStep.title,
          customerName: selectedCustomer.name,
          stage: firstStep.assignedToDept,
          assignedToDept: firstStep.assignedToDept,
          assignedToUser: userId,
          startTime: Date.now(),
          tatMinutes: firstStep.tatMinutes,
          status: 'Pending',
          details: `Ref: ${currentOrderDisplayNo}. Instructions: ${firstStep.how}`,
          pipelineId: orderPipeline.id,
          currentStepIndex: 0,
          contextData: { orderNo: currentOrderDisplayNo },
          checklist: firstStep.requiresChecklist ? firstStep.checklistItems.map(text => ({ text, isCompleted: false })) : [],
          attachedFormId: firstStep.requiresForm ? firstStep.attachedFormId : '',
          formAnswers: {}
        }]);
        setNotification(`Order saved & pushed to automated workflow: ${orderPipeline.name}!`);
      } else {
        setNotification(`Order saved successfully! No specific flowchart pipeline found for trigger: ${expectedTrigger}`);
      }
    }
    handleClearCustomer();
  };

  const handleEditOrder = (order) => {
    setSelectedCustomer(order.customer); setOrderLines(order.lines); setPackingCharges(order.packingCharges || 0); setCustomizationCharges(order.customizationCharges || 0); setEditingOrderId(order.orderNo); setOrderTransport(order.transport || order.customer.transport || ''); setCcAttached(order.ccAttached || 'No'); setGlobalCustomization(order.globalCustomization || 'No'); setGlobalCustomizationType(order.globalCustomizationType || ''); navigateTab('order');
  };
  
  const handleDeleteOrder = (orderNo) => {
    setConfirmDialog({
      isOpen: true,
      message: `Are you sure you want to delete order ${orderNo}?`,
      onConfirm: () => {
        setSavedOrders(savedOrders.filter(o => o.orderNo !== orderNo));
        setNotification(`Order ${orderNo} deleted.`);
      }
    });
  };

  const sendWhatsApp = () => {
    if (!selectedCustomer) return;
    const { grandTotal, baseSubtotal, discountAmount, packing, customization, gstAmount, roundOff } = calculations;
    
    let message = `*Order Confirmation - Sanganeri Cart* 🛒\n`;
    message += `*Order No:* ${currentOrderDisplayNo}\n\n`;
    message += `*Firm:* ${selectedCustomer.name}\n`;
    if (selectedCustomer.kycNumber) message += `*${selectedCustomer.kycType}:* ${selectedCustomer.kycNumber}\n`;
    message += `*Address:* ${selectedCustomer.address}\n`;
    message += `*Transport:* ${orderTransport || 'N/A'}\n`;
    message += `*CC Attached:* ${ccAttached}\n`;
    message += `*Date:* ${new Date().toLocaleDateString()}\n\n`;
    message += `*Items Ordered:*\n`;
    
    orderLines.forEach((line, index) => {
      if (line.itemId) {
        const item = items.find(i => i.id === line.itemId);
        const finalRate = (line.rate || 0);
        const lineTotal = line.quantity * finalRate;
        const customizedText = line.isCustomized === 'Yes' ? ` [Customised: ${globalCustomizationType}]` : '';
        message += `${index + 1}. *${item.design}*${customizedText}\n   [${item.category} | ${item.size}]\n   Qty: ${line.quantity} x ₹${finalRate.toFixed(2)} = ₹${lineTotal.toFixed(2)}\n`;
      }
    });

    message += `\n*Summary:*\n`;
    message += `Item Subtotal: ₹${baseSubtotal.toFixed(2)}\n`;
    if (customization > 0.01) message += `Customization: +₹${customization.toFixed(2)}\n`;
    if (discountAmount > 0.01) message += `Discount (${selectedCustomer.discount}%): -₹${discountAmount.toFixed(2)}\n`;
    if (packing > 0.01) message += `Packing Charges: +₹${packing.toFixed(2)}\n`;
    message += `GST (5%): +₹${gstAmount.toFixed(2)}\n`;
    if (Math.abs(roundOff) > 0.01) message += `Round Off: ${roundOff > 0 ? '+' : ''}₹${roundOff.toFixed(2)}\n`;
    message += `*Grand Total: ₹${grandTotal.toFixed(2)}*\n\n`;
    message += `Generated by: ${currentUser.name}\n`;
    message += `Thank you for your business! Please confirm the order.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/91${selectedCustomer.phone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handlePrint = (savedOrderData = null) => {
    const orderToPrint = savedOrderData || {
      orderNo: currentOrderDisplayNo, date: new Date().toISOString(), customer: selectedCustomer, lines: orderLines, calculations: calculations, createdBy: currentUser.name, transport: orderTransport, ccAttached: ccAttached, globalCustomization: globalCustomization, globalCustomizationType: globalCustomizationType
    };

    if (!orderToPrint.customer) return;

    const { orderNo, date, customer, lines, calculations: calc, createdBy, transport, ccAttached: printCcAttached, globalCustomization: printCust, globalCustomizationType: printCustType } = orderToPrint;
    const { grandTotal, baseSubtotal, discountAmount, packing, customization, gstAmount, roundOff } = calc;

    let completeHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Order Invoice - ${orderNo}</title>
        <style>
          body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #333; max-width: 800px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #2c3e50; padding-bottom: 20px; margin-bottom: 30px; }
          .company-details h1 { margin: 0 0 5px 0; color: #2c3e50; font-size: 28px; }
          .company-details p { margin: 2px 0; color: #666; font-size: 14px; }
          .customer-details { text-align: right; }
          .customer-details h3 { margin: 0 0 5px 0; color: #333; }
          .customer-details p { margin: 2px 0; font-size: 14px; color: #555; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; }
          th, td { border-bottom: 1px solid #ddd; padding: 12px 15px; text-align: left; }
          th { background-color: #f8f9fa; font-weight: 600; color: #444; border-bottom: 2px solid #ddd; }
          td.right, th.right { text-align: right; }
          td.center, th.center { text-align: center; }
          .item-meta { display: block; font-size: 12px; color: #777; margin-top: 4px; }
          .summary-box { width: 300px; margin-left: auto; margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px; }
          .summary-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; }
          .summary-row.discount { color: #27ae60; }
          .summary-row.total { border-top: 2px solid #ddd; margin-top: 10px; padding-top: 15px; font-size: 18px; font-weight: bold; color: #e74c3c; }
          .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
        <div class="company-details">
          <h1>SANGANERICART</h1>
          <p>Order No: <strong>${orderNo}</strong></p>
          <p>Date: ${new Date(date).toLocaleDateString()}</p>
          <p style="margin-top: 10px; color: #444;">Generated By: <strong>${createdBy || currentUser.name}</strong></p>
        </div>
        <div class="customer-details">
          <p style="text-transform: uppercase; font-size: 11px; font-weight: bold; color: #888; letter-spacing: 1px;">Billed To:</p>
          <h3>${customer.name}</h3>
          ${customer.kycNumber ? `<p style="font-weight: 600;">${customer.kycType}: ${customer.kycNumber}</p>` : ''}
          <p>ID: ${customer.id}</p>
          <p>Ph: +91 ${customer.phone}</p>
          <p>${customer.address || ''}</p>
          <p style="margin-top: 5px;"><strong>Transport:</strong> ${transport || 'N/A'}</p>
          <p><strong>CC Attached:</strong> ${printCcAttached || 'No'}</p>
        </div>
      </div>

      <table>
          <thead>
            <tr>
              <th class="center" style="width: 40px;">#</th>
              <th>Item Description</th>
              <th class="center" style="width: 60px;">Qty</th>
              <th class="right" style="width: 90px;">Rate</th>
              <th class="right" style="width: 110px;">Amount</th>
            </tr>
          </thead>
          <tbody>
    `;

    lines.forEach((line, index) => {
      if (line.itemId) {
        const item = items.find(i => i.id === line.itemId);
        const finalRate = (line.rate || 0);
        const lineTotal = line.quantity * finalRate;
        const customizedTag = line.isCustomized === 'Yes' ? ` <span style="color:#e74c3c; font-size:11px; font-weight:bold; margin-left:4px;">[Customised: ${printCustType}]</span>` : '';
        completeHTML += `
          <tr>
            <td class="center">${index + 1}</td>
            <td>
              <strong>${item.design}</strong>${customizedTag}
              <span class="item-meta">${item.category} | ${item.size}</span>
            </td>
            <td class="center">${line.quantity}</td>
            <td class="right">₹${(line.rate || 0).toFixed(2)}</td>
            <td class="right">₹${lineTotal.toFixed(2)}</td>
          </tr>
        `;
      }
    });

    completeHTML += `
          </tbody>
        </table>

        <div class="summary-box">
          <div class="summary-row">
            <span>Item Subtotal</span>
            <span>₹${baseSubtotal.toFixed(2)}</span>
          </div>
    `;

    if (customization > 0.01) { completeHTML += `<div class="summary-row"><span>Customization Charges</span><span>+ ₹${customization.toFixed(2)}</span></div>`; }
    if (discountAmount > 0.01) { completeHTML += `<div class="summary-row discount"><span>Discount (${customer.discount || 0}%)</span><span>- ₹${discountAmount.toFixed(2)}</span></div>`; }
    if (packing > 0.01) { completeHTML += `<div class="summary-row"><span>Packing Charges</span><span>+ ₹${packing.toFixed(2)}</span></div>`; }
    completeHTML += `<div class="summary-row"><span>GST (5%)</span><span>+ ₹${gstAmount.toFixed(2)}</span></div>`;
    if (Math.abs(roundOff) > 0.01) { completeHTML += `<div class="summary-row" style="color: #888; font-size: 12px;"><span>Round Off</span><span>${roundOff > 0 ? '+' : ''}₹${roundOff.toFixed(2)}</span></div>`; }

    completeHTML += `
          <div class="summary-row total">
            <span>Grand Total</span>
            <span>₹${grandTotal.toFixed(2)}</span>
          </div>
        </div>

        <div class="footer">
          This is an electronically generated order summary and does not require a signature.
        </div>
        
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          };
        </script>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open(); printWindow.document.write(completeHTML); printWindow.document.close();
    } else {
      setNotification('Pop-up blocked! Please allow pop-ups for this site to print invoices.');
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(u => u.id.toUpperCase() === loginId.toUpperCase() && u.password === loginPassword);
    if (user) {
      setCurrentUser(user); setLoginError(''); setActiveTab('dashboard'); setExpandedDept('dashboard');
    } else { setLoginError('Invalid ID or Password'); }
  };

  const handleLogout = () => { setCurrentUser(null); setLoginId(''); setLoginPassword(''); };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUserName || !newUserId || !newUserPassword || newUserRoles.length === 0) {
      setNotification('Please fill all fields and select at least one department access.');
      return;
    }
    if (users.find(u => u.id.toUpperCase() === newUserId.toUpperCase())) {
      setNotification('User ID already exists!');
      return;
    }
    setUsers([...users, { id: newUserId.toUpperCase(), name: newUserName.toUpperCase(), password: newUserPassword, roles: newUserRoles }]);
    setNewUserName(''); setNewUserId(''); setNewUserPassword(''); setNewUserRoles([]);
    setNotification('Staff Account Created');
  };
  const handleRemoveUser = (id) => { setUsers(users.filter(u => u.id !== id)); };

  const toggleNewUserRole = (roleId) => {
    if (newUserRoles.includes(roleId)) {
      setNewUserRoles(newUserRoles.filter(r => r !== roleId));
    } else {
      setNewUserRoles([...newUserRoles, roleId]);
    }
  };

  const navigateTab = (tabName) => { setActiveTab(tabName); setIsMobileMenuOpen(false); };

  // --- CSV UPLOAD/DOWNLOAD LOGIC ---
  const downloadTransportTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,id,name,gstNo,contact,driverName,pickupSlot\nTRP-999,SAMPLE LOGISTICS,08AABCT0000Z1,9876543210,RAMESH,MORNING\n";
    const link = document.createElement("a"); link.setAttribute("href", encodeURI(csvContent)); link.setAttribute("download", "transport_master_template.csv"); document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };
  const exportTransportsToCSV = () => {
    if (masterSettings.transports.length === 0) return;
    const rows = masterSettings.transports.map(t => `${t.id},"${t.name}","${t.gstNo}","${t.contact}","${t.driverName}","${t.pickupSlot}"`).join('\n');
    const csvContent = "data:text/csv;charset=utf-8,id,name,gstNo,contact,driverName,pickupSlot\n" + rows;
    const link = document.createElement("a"); link.setAttribute("href", encodeURI(csvContent)); link.setAttribute("download", "current_transports_export.csv"); document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };
  const handleTransportUpload = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const rows = event.target.result.split('\n').filter(row => row.trim());
      const newTransports = rows.slice(1).map(row => {
        const clean = (row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || []).map(item => item?.replace(/"/g, '').trim() || '');
        return { id: clean[0] || `TRP-${Date.now()}`, name: clean[1]?.toUpperCase() || '', gstNo: clean[2]?.toUpperCase() || '', contact: clean[3]?.toUpperCase() || '', driverName: clean[4]?.toUpperCase() || '', pickupSlot: clean[5]?.toUpperCase() || '' };
      }).filter(t => t.name !== '');
      if (newTransports.length > 0) { setMasterSettings(prev => ({ ...prev, transports: newTransports })); setNotification(`Loaded ${newTransports.length} transports!`); }
    }; reader.readAsText(file); e.target.value = null; 
  };
  const downloadCustomerTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,id,name,phone,mobile2,mobile3,address,city,state,kycType,kycNumber,kycSigned,rateList,discount,agentName,salesPerson,crm,whatsappGroup,personalGroup,paymentDays,transport,customerType,status,statusRemark\nCUST-999,Sample Firm,9876543210,,,Sample Address,Jaipur,Rajasthan,GST,08ABCDE1234F1Z5,Yes,Wholesale_7,5,Agent Rahul,Amit Kumar,Pooja,Yes,No,30,Navkar Logistics,Wholesaler,Working,\n";
    const link = document.createElement("a"); link.setAttribute("href", encodeURI(csvContent)); link.setAttribute("download", "customer_master_template.csv"); document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };
  const downloadRateListTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,id,category,size,design,Base_Price,Wholesale_7,Super_15\nITM-999,SINGLE BEDSHEET,63x90,Sample Design,500,480,450\n";
    const link = document.createElement("a"); link.setAttribute("href", encodeURI(csvContent)); link.setAttribute("download", "rate_list_template.csv"); document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };
  const exportCustomersToCSV = () => {
    if (filteredCustomerMaster.length === 0) { setNotification("No customers to export."); return; }
    const rows = filteredCustomerMaster.map(c => `${c.id},"${c.name}",${c.phone},${c.mobile2 || ''},${c.mobile3 || ''},"${c.address}","${c.city || ''}","${c.state || ''}","${c.kycType || 'GST'}","${c.kycNumber || ''}","${c.kycSigned || 'No'}",${c.rateList},${c.discount},"${c.agentName || ''}","${c.salesPerson || ''}","${c.crm || ''}","${c.whatsappGroup || ''}","${c.personalGroup || ''}",${c.paymentDays || ''},"${c.transport || ''}","${c.customerType || ''}","${c.status || 'Working'}","${c.statusRemark || ''}"`).join('\n');
    const csvContent = "data:text/csv;charset=utf-8,id,name,phone,mobile2,mobile3,address,city,state,kycType,kycNumber,kycSigned,rateList,discount,agentName,salesPerson,crm,whatsappGroup,personalGroup,paymentDays,transport,customerType,status,statusRemark\n" + rows;
    const link = document.createElement("a"); link.setAttribute("href", encodeURI(csvContent)); link.setAttribute("download", "filtered_customers.csv"); document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };
  const exportRateListToCSV = () => {
    if (items.length === 0) return;
    const rows = items.map(item => `${item.id},"${item.category}","${item.size}","${item.design}",` + availableRateLists.map(rl => item.rates[rl] || 0).join(',')).join('\n');
    const csvContent = "data:text/csv;charset=utf-8,id,category,size,design," + availableRateLists.join(',') + "\n" + rows;
    const link = document.createElement("a"); link.setAttribute("href", encodeURI(csvContent)); link.setAttribute("download", "rate_list_export.csv"); document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };
  const handleCustomerUpload = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const rows = event.target.result.split('\n').filter(row => row.trim());
      const newCustomers = rows.slice(1).map(row => {
        const clean = (row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || []).map(item => item?.replace(/"/g, '').trim() || '');
        return { id: clean[0], name: clean[1], phone: clean[2], mobile2: clean[3], mobile3: clean[4], address: clean[5], city: clean[6], state: clean[7], kycType: clean[8] || 'GST', kycNumber: clean[9], kycSigned: clean[10] || 'No', rateList: clean[11], discount: parseFloat(clean[12]) || 0, agentName: clean[13], salesPerson: clean[14], crm: clean[15], whatsappGroup: clean[16], personalGroup: clean[17], paymentDays: parseInt(clean[18]) || 0, transport: clean[19], customerType: clean[20], status: clean[21] || 'Working', statusRemark: clean[22] || '' };
      });
      if (newCustomers.length > 0) { setCustomers(newCustomers); setNotification(`Loaded ${newCustomers.length} customers!`); }
    }; reader.readAsText(file); e.target.value = null; 
  };
  const handleRateListUpload = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const rows = event.target.result.split('\n').filter(row => row.trim());
      const rateListNames = rows[0].split(',').map(h => h.trim()).slice(4); 
      const newItems = rows.slice(1).map(row => {
        const values = row.split(',').map(v => v.replace(/"/g, '').trim());
        const rates = {}; rateListNames.forEach((listName, idx) => { rates[listName] = parseFloat(values[idx + 4]) || 0; });
        return { id: values[0], category: values[1], size: values[2], design: values[3], rates };
      });
      if (newItems.length > 0) { setItems(newItems); setNotification(`Loaded ${newItems.length} items!`); }
    }; reader.readAsText(file); e.target.value = null; 
  };


  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#161a23] relative overflow-hidden font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-2xl z-10 w-full max-w-md border border-gray-100 mx-4">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-[#f0f4ff] rounded-2xl flex items-center justify-center mb-4"><Calculator className="w-8 h-8 text-[#4c6fff]" /></div>
            <h1 className="text-2xl font-bold text-[#1a1d2d]">Sanganeri ERP</h1>
            <p className="text-gray-500 text-sm mt-1">Sign in to access your dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">User ID</label>
              <div className="relative">
                <User className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                <input type="text" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4c6fff] focus:border-[#4c6fff] outline-none" placeholder="e.g. ADMIN / CRM1" value={loginId} onChange={(e) => setLoginId(e.target.value.toUpperCase())} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                <input type="password" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4c6fff] focus:border-[#4c6fff] outline-none" placeholder="e.g. 123" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
              </div>
            </div>
            {loginError && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium flex items-center gap-2"><AlertCircle className="w-4 h-4" />{loginError}</div>}
            <button type="submit" className="w-full bg-[#4c6fff] hover:bg-[#3b59df] text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg shadow-blue-500/30 mt-2">Secure Login</button>
          </form>
        </div>
      </div>
    );
  }

  // Filter tasks for the current user's dashboard
  const myDelegations = delegations.filter(d => d.assignedToUser === currentUser.id || currentUser.roles.includes('admin'));
  const myChecklists = checklists.filter(c => c.assignedToUser === currentUser.id || currentUser.roles.includes('admin'));
  const myFlowcharts = flowchartTasks.filter(f => f.assignedToUser === currentUser.id || currentUser.roles.includes('admin'));

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#f7f8fc] font-sans text-gray-800 relative">
      {notification && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 z-50 animate-bounce border-l-4 border-[#2ecc71]">
          <CheckCircle className="w-5 h-5 text-[#2ecc71]" />
          <span className="font-medium text-sm tracking-wide">{notification}</span>
          <button onClick={() => setNotification('')} className="ml-4 hover:text-gray-300"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* CUSTOM CONFIRMATION MODAL */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-3 text-red-500">
              <AlertOctagon className="w-6 h-6" />
              <h3 className="text-lg font-bold text-gray-900">Confirm Deletion</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6 font-medium leading-relaxed">
              {confirmDialog.message}
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmDialog({ isOpen: false, message: '', onConfirm: null })} className="px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                Cancel
              </button>
              <button onClick={() => { confirmDialog.onConfirm(); setConfirmDialog({ isOpen: false, message: '', onConfirm: null }); }} className="px-4 py-2.5 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors shadow-sm">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE HEADER */}
      <div className="md:hidden bg-[#161a23] p-4 flex items-center gap-4 text-white sticky top-0 z-40 shadow-md">
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-300 hover:text-white transition-colors">{isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
        <div className="flex items-center gap-2 font-bold"><Calculator className="w-5 h-5 text-[#4c6fff]" /><span>Sanganeri ERP</span></div>
      </div>
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />}

      {/* SIDEBAR */}
      <aside className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out fixed md:sticky top-0 left-0 h-screen w-[260px] bg-[#161a23] text-gray-400 flex flex-col shrink-0 shadow-xl z-50`}>
        <div className="p-6 pb-2 hidden md:block">
          <div className="flex items-center gap-3 text-white font-bold text-xl tracking-wide mb-2"><Calculator className="w-6 h-6 text-[#4c6fff]" /><span>Sanganeri ERP</span></div>
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest text-gray-500 uppercase mt-2 ml-1"><span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>Cloud Synced</div>
        </div>

        <nav className="flex-1 px-3 space-y-2 mt-6 md:mt-2 overflow-y-auto pb-4 custom-scrollbar">
          {DEPARTMENTS.filter(dept => currentUser?.roles?.includes('admin') || dept.roles.some(r => currentUser?.roles?.includes(r))).map(dept => (
            <div key={dept.id} className="flex flex-col">
              <button onClick={() => setExpandedDept(expandedDept === dept.id ? '' : dept.id)} className={`flex items-center justify-between w-full px-3 py-2.5 rounded-lg transition-colors ${expandedDept === dept.id ? 'bg-[#2a3042] text-white' : 'text-gray-400 hover:bg-[#2a3042]/50 hover:text-gray-200'}`}>
                <div className="flex items-center gap-3"><dept.icon className="w-4 h-4" /><span className="text-xs font-bold uppercase tracking-wider">{dept.name}</span></div>
                <ChevronDown className={`w-4 h-4 transition-transform ${expandedDept === dept.id ? 'rotate-180' : ''}`} />
              </button>
              {expandedDept === dept.id && (
                <div className="mt-1.5 flex flex-col gap-1 pl-4 border-l border-gray-700 ml-5 mb-2">
                  {dept.items.length > 0 ? (
                    dept.items.map(item => (
                      <button key={item.tab} onClick={() => navigateTab(item.tab)} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm font-medium ${activeTab === item.tab ? 'bg-[#4c6fff] text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                        <item.icon className="w-4 h-4" /> {item.label}
                      </button>
                    ))
                  ) : (<div className="px-3 py-2 text-[11px] text-gray-500 italic">Module incoming...</div>)}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <div className="flex justify-between items-center w-full pt-4 border-t border-gray-700/50">
            <div className="flex flex-col"><span className="font-bold text-sm text-white">{currentUser?.name}</span><span className="text-xs text-gray-400 capitalize truncate max-w-[150px]">{currentUser?.roles?.join(', ')}</span></div>
            <button onClick={handleLogout} className="text-[#e74c3c] hover:text-red-400 text-sm font-medium transition-colors flex items-center gap-1"><LogOut className="w-4 h-4" /></button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 md:p-8 overflow-auto bg-[#f8f9fc]">
        
        <header className="mb-6 border-b border-gray-200 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-2">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1a1d2d] tracking-tight">
              {activeTab === 'dashboard' && 'My Daily Workflow'}
              {activeTab === 'order' && 'Order Form Generation'}
              {activeTab === 'onboarding' && (editingCustomerId ? 'Edit CRM Profile' : 'New CRM Onboarding')}
              {activeTab === 'history' && 'Order Master'}
              {activeTab === 'customers' && 'CRM Master Data'}
              {activeTab === 'rates' && 'Rate List Catalog'}
              {activeTab === 'users' && 'Staff Management'}
              {activeTab === 'settings' && 'System Master Settings'}
              {activeTab === 'transport_master' && 'Transport & Logistics Master'}
              {activeTab === 'dispatch_ops' && 'Daily Dispatch & Bale Tracking'}
              {activeTab === 'workflow_builder' && 'MDO Workflow & Task Engine'}
            </h1>
            <p className="text-sm text-gray-500 mt-1 font-medium">
              {activeTab === 'dashboard' && `Welcome back, ${currentUser.name}. Here are your pending tasks across all pipelines.`}
              {activeTab === 'order' && 'Create orders rapidly with auto-fetching rates.'}
              {activeTab === 'dispatch_ops' && 'Track daily bale packing, driver assignments, and generate dispatch numbers.'}
              {activeTab === 'workflow_builder' && 'Build checklists, assign delegations, and monitor the automated TAT pipeline.'}
            </p>
          </div>
          {activeTab === 'dashboard' && (
             <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm text-xs font-bold text-gray-600">
               <Clock className="w-4 h-4 text-blue-500" />
               TAT Clock Active
             </div>
          )}
        </header>

        {/* --- TAB: DASHBOARD (UNIVERSAL TASK MANAGER) --- */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* COLUMN 1: AUTOMATED FLOWCHART PIPELINE */}
            <div className="flex flex-col gap-4">
              <div className="bg-[#4c6fff] text-white px-4 py-3 rounded-lg shadow-md flex justify-between items-center">
                <h3 className="font-bold tracking-wide flex items-center gap-2"><Layers className="w-5 h-5"/> Live Flowchart</h3>
                <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-black">{myFlowcharts.filter(f=>f.status==='Pending').length} Pending</span>
              </div>
              <div className="flex flex-col gap-3">
                {myFlowcharts.filter(f=>f.status==='Pending').length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-gray-400 text-sm shadow-sm">No active pipeline tasks in your queue.</div>
                ) : (
                  myFlowcharts.filter(f=>f.status==='Pending').map(task => {
                    const isChecklistReady = !task.checklist || task.checklist.length === 0 || task.checklist.every(c => c.isCompleted);
                    
                    const isFormReady = !task.attachedFormId || (() => {
                      const form = formMasters.find(fm => fm.id === task.attachedFormId);
                      if (!form) return true;
                      return form.fields.every(f => task.formAnswers && task.formAnswers[f.id] && task.formAnswers[f.id].trim() !== '');
                    })();
                    
                    const isReadyToComplete = isChecklistReady && isFormReady;

                    return (
                      <div key={task.id} className="bg-white border-l-4 border-blue-500 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-blue-50 text-blue-600 text-[10px] font-black px-2 py-1 uppercase rounded-bl-lg">Stage: {task.stage}</div>
                        <h4 className="font-bold text-gray-800 text-sm w-3/4 leading-tight">{task.title}</h4>
                        <p className="text-xs text-gray-500 mt-1 font-medium">{task.customerName}</p>
                        <p className="text-xs text-gray-400 mt-1 mb-3 bg-gray-50 p-2 rounded border border-gray-100">{task.details}</p>
                        
                        {/* INLINE TASK CHECKLIST */}
                        {task.checklist && task.checklist.length > 0 && (
                          <div className="mt-2 mb-4 bg-white p-2.5 rounded border border-blue-100 shadow-sm">
                            <p className="text-[10px] font-bold text-blue-800 uppercase tracking-wider mb-2">Required Checklist Items</p>
                            <div className="space-y-2">
                              {task.checklist.map((item, cIdx) => (
                                <label key={cIdx} className="flex items-start gap-2 cursor-pointer group">
                                  <input type="checkbox" checked={item.isCompleted} onChange={() => toggleFlowchartChecklist(task.id, cIdx)} className="mt-0.5 accent-blue-600 w-3.5 h-3.5" />
                                  <span className={`text-xs font-medium leading-tight ${item.isCompleted ? 'line-through text-gray-400' : 'text-gray-700 group-hover:text-blue-600'}`}>{item.text}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* INLINE TASK FORM */}
                        {task.attachedFormId && (
                           <div className="mt-2 mb-4 bg-purple-50/50 p-3 rounded border border-purple-200 shadow-sm">
                              <p className="text-[10px] font-bold text-purple-800 uppercase tracking-wider mb-3 flex items-center gap-1.5"><FileQuestion className="w-3.5 h-3.5" /> Required Data Form</p>
                              {formMasters.find(fm => fm.id === task.attachedFormId)?.fields.map(field => (
                                 <div key={field.id} className="mb-3 last:mb-0">
                                    <label className="block text-[10px] font-bold text-gray-700 mb-1">{field.label}</label>
                                    {field.type === 'Yes/No' ? (
                                       <select 
                                         className={`w-full text-xs p-1.5 border rounded outline-none focus:ring-1 focus:ring-purple-400 ${task.formAnswers?.[field.id] ? 'bg-green-50 border-green-300' : 'bg-white border-gray-300'}`}
                                         value={task.formAnswers?.[field.id] || ''} 
                                         onChange={e => handleFlowchartFormInput(task.id, field.id, e.target.value)}
                                       >
                                         <option value="">-Select-</option>
                                         <option value="Yes">Yes</option>
                                         <option value="No">No</option>
                                       </select>
                                    ) : (
                                       <input 
                                         type={field.type === 'Number' ? 'number' : 'text'} 
                                         className={`w-full text-xs p-1.5 border rounded outline-none focus:ring-1 focus:ring-purple-400 ${task.formAnswers?.[field.id] ? 'bg-green-50 border-green-300' : 'bg-white border-gray-300'}`}
                                         value={task.formAnswers?.[field.id] || ''} 
                                         onChange={e => handleFlowchartFormInput(task.id, field.id, e.target.value)}
                                       />
                                    )}
                                 </div>
                              ))}
                           </div>
                        )}

                        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                          {formatTAT(task.startTime, task.tatMinutes)}
                          <button 
                            onClick={() => progressFlowchart(task.id)} 
                            disabled={!isReadyToComplete}
                            title={!isReadyToComplete ? "Complete all checklists and form fields first" : ""}
                            className={`px-3 py-1.5 rounded text-xs font-bold transition-colors shadow-sm ${isReadyToComplete ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                          >
                            Complete & Push →
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* COLUMN 2: DELEGATION SHEET */}
            <div className="flex flex-col gap-4">
              <div className="bg-[#9b59b6] text-white px-4 py-3 rounded-lg shadow-md flex justify-between items-center">
                <h3 className="font-bold tracking-wide flex items-center gap-2"><Target className="w-5 h-5"/> Delegations</h3>
                <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-black">{myDelegations.filter(d=>d.status==='Pending').length} Pending</span>
              </div>
              <div className="flex flex-col gap-3">
                {myDelegations.filter(d=>d.status==='Pending').length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-gray-400 text-sm shadow-sm">No active delegations for you.</div>
                ) : (
                  myDelegations.filter(d=>d.status==='Pending').map(task => {
                    const isOverdue = task.deadline && currentTime > task.deadline;
                    const isMdoOrAdmin = currentUser.roles.includes('admin') || currentUser.roles.includes('mdo');
                    
                    return (
                      <div key={task.id} className={`bg-white border ${isOverdue ? 'border-red-300' : 'border-gray-200'} rounded-lg p-4 shadow-sm relative overflow-hidden`}>
                        {isOverdue && <div className="absolute top-0 right-0 bg-red-100 text-red-600 text-[10px] font-black px-2 py-1 uppercase rounded-bl-lg animate-pulse">OVERDUE</div>}
                        <h4 className="font-bold text-gray-800 text-sm w-3/4">{task.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Assigned By: <span className="font-semibold text-purple-600">{task.assignedBy}</span>
                          {currentUser.roles.includes('admin') && (
                            <span className="ml-2 pl-2 border-l border-gray-300">
                              To: <span className="font-semibold text-gray-700">{users.find(u => u.id === task.assignedToUser)?.name || 'Unknown'}</span>
                            </span>
                          )}
                        </p>
                        {task.deadline && (
                          <p className="text-xs font-bold mt-1 text-gray-600">
                            Deadline: <span className={isOverdue ? "text-red-500" : "text-green-600"}>{new Date(task.deadline).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                          </p>
                        )}
                        <p className="text-xs text-gray-600 mt-2 bg-purple-50 p-2 rounded">{task.description}</p>
                        
                        {isOverdue ? (
                            isMdoOrAdmin ? (
                               <div className="mt-3 border-t border-gray-100 pt-3">
                                 <p className="text-[10px] text-red-500 font-bold mb-2">TASK OVERDUE - RESCHEDULE REQUIRED</p>
                                 {rescheduleData.id === task.id ? (
                                    <div className="flex gap-2">
                                       <input type="datetime-local" className="flex-1 text-xs border border-gray-300 rounded p-1.5 outline-none focus:border-red-400" value={rescheduleData.newDeadline} onChange={(e) => setRescheduleData({...rescheduleData, newDeadline: e.target.value})} />
                                       <button onClick={() => handleReschedule(task.id)} className="bg-red-500 text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-red-600">Save</button>
                                       <button onClick={() => setRescheduleData({id: null, newDeadline: ''})} className="bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-xs font-bold hover:bg-gray-300">Cancel</button>
                                    </div>
                                 ) : (
                                    <button onClick={() => setRescheduleData({id: task.id, newDeadline: ''})} className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-3 py-2 rounded text-xs font-bold transition-colors shadow-sm">Reschedule Deadline</button>
                                 )}
                               </div>
                            ) : (
                               <button disabled className="w-full mt-3 bg-red-50 border border-red-200 text-red-500 px-3 py-2 rounded text-xs font-bold shadow-sm cursor-not-allowed flex items-center justify-center gap-2">
                                  <AlertOctagon className="w-4 h-4" /> Overdue - Contact MDO to Reschedule
                               </button>
                            )
                        ) : (
                            <button onClick={() => completeTask('delegation', task.id)} className="w-full mt-3 bg-white border border-purple-300 text-purple-600 hover:bg-purple-50 px-3 py-2 rounded text-xs font-bold transition-colors shadow-sm">
                              Mark as Completed
                            </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* COLUMN 3: RECURRING CHECKLISTS */}
            <div className="flex flex-col gap-4">
              <div className="bg-[#e67e22] text-white px-4 py-3 rounded-lg shadow-md flex justify-between items-center">
                <h3 className="font-bold tracking-wide flex items-center gap-2"><CheckSquare className="w-5 h-5"/> My Checklists</h3>
              </div>
              <div className="flex flex-col gap-3">
                {myChecklists.filter(c=>c.status==='Pending').length === 0 ? (
                  <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-gray-400 text-sm shadow-sm">All checklists complete!</div>
                ) : (
                  myChecklists.filter(c=>c.status==='Pending').map(task => (
                    <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex items-center justify-between gap-3 group hover:border-orange-300 transition-colors">
                      <div className="flex items-start gap-3">
                        <button onClick={() => completeTask('checklist', task.id)} className="w-6 h-6 mt-1 rounded border-2 border-gray-300 hover:border-orange-500 flex items-center justify-center text-white hover:bg-orange-500 transition-colors shrink-0">
                          <CheckCircle className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                        </button>
                        <div>
                          <h4 className="font-bold text-gray-800 text-sm">{task.title}</h4>
                          <div className="text-[10px] font-bold text-orange-500 uppercase tracking-wider mt-0.5">
                            {task.frequency} Routine
                            {task.frequency === 'Monthly' && ` (${task.monthlyDay})`}
                          </div>
                          <div className="text-[10px] text-gray-500 mt-1 font-medium">Starts: {new Date(task.startDate).toLocaleDateString()}</div>
                          {currentUser.roles.includes('admin') && (
                            <div className="text-[10px] text-gray-500 mt-0.5">
                              Assigned to: <span className="font-semibold text-gray-700">{users.find(u=>u.id===task.assignedToUser)?.name || task.assignedToUser}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

        {/* --- TAB: MDO WORKFLOW BUILDER --- */}
        {activeTab === 'workflow_builder' && (currentUser?.roles?.includes('admin') || currentUser?.roles?.includes('mdo')) && (
          <div className="space-y-6">
            
            {/* Sub-Navigation for Workflow Engine */}
            <div className="flex flex-wrap gap-3 bg-white p-3 rounded-xl shadow-sm border border-gray-200">
              <button onClick={() => setMdoWorkflowTab('delegation')} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${mdoWorkflowTab === 'delegation' ? 'bg-[#9b59b6] text-white shadow-md scale-[1.02]' : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'}`}>
                <Target className="w-4 h-4" /> Delegations
              </button>
              <button onClick={() => setMdoWorkflowTab('checklist')} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${mdoWorkflowTab === 'checklist' ? 'bg-[#e67e22] text-white shadow-md scale-[1.02]' : 'text-gray-600 hover:bg-orange-50 hover:text-orange-700'}`}>
                <CheckSquare className="w-4 h-4" /> Checklists
              </button>
              <button onClick={() => setMdoWorkflowTab('forms')} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${mdoWorkflowTab === 'forms' ? 'bg-[#2ecc71] text-white shadow-md scale-[1.02]' : 'text-gray-600 hover:bg-green-50 hover:text-green-700'}`}>
                <FileQuestion className="w-4 h-4" /> Form Masters
              </button>
              <button onClick={() => setMdoWorkflowTab('flowchart')} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${mdoWorkflowTab === 'flowchart' ? 'bg-blue-600 text-white shadow-md scale-[1.02]' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'}`}>
                <Layers className="w-4 h-4" /> Flowchart Monitor
              </button>
            </div>

            {/* 1. DELEGATIONS VIEW */}
            {mdoWorkflowTab === 'delegation' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Delegation Generator */}
                <div className="xl:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit">
                  <div className="bg-[#9b59b6] px-5 py-4 flex items-center gap-3 text-white">
                    <Target className="w-5 h-5" />
                    <h2 className="font-semibold text-lg tracking-wide">Assign a Delegation</h2>
                  </div>
                  <form onSubmit={handleCreateDelegation} className="p-6 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Task Title <span className="text-red-500">*</span></label>
                      <input type="text" required value={newDelegation.title} onChange={e=>setNewDelegation({...newDelegation, title: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:ring-1 focus:ring-purple-400 outline-none text-sm"/>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Detailed Description</label>
                      <textarea rows="3" value={newDelegation.description} onChange={e=>setNewDelegation({...newDelegation, description: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:ring-1 focus:ring-purple-400 outline-none text-sm resize-none"></textarea>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Assign To Dept <span className="text-red-500">*</span></label>
                        <select value={newDelegation.assignedToDept} onChange={e=>setNewDelegation({...newDelegation, assignedToDept: e.target.value, assignedToUser: ''})} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:ring-1 focus:ring-purple-400 outline-none text-sm font-semibold">
                          {masterSettings.roles.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Assign To Employee <span className="text-red-500">*</span></label>
                        <select required value={newDelegation.assignedToUser} onChange={e=>setNewDelegation({...newDelegation, assignedToUser: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:ring-1 focus:ring-purple-400 outline-none text-sm font-semibold text-purple-700">
                          <option value="">-- Select Employee --</option>
                          {users.filter(u => u.roles.includes(newDelegation.assignedToDept)).map(u => (
                            <option key={u.id} value={u.id}>{u.name} ({u.id})</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Deadline (Date & Time) <span className="text-red-500">*</span></label>
                      <input type="datetime-local" required value={newDelegation.deadline} onChange={e=>setNewDelegation({...newDelegation, deadline: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:ring-1 focus:ring-purple-400 outline-none text-sm"/>
                    </div>
                    <button type="submit" className="w-full bg-[#9b59b6] hover:bg-[#8e44ad] text-white font-bold py-3 rounded-lg shadow-sm transition-colors mt-2">Delegate Task</button>
                  </form>
                </div>

                {/* Delegations Manager Table */}
                <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-[#8e44ad] px-5 py-4 flex items-center justify-between text-white">
                    <h2 className="font-semibold text-lg tracking-wide">All Delegations Overview</h2>
                    <span className="bg-white/20 px-3 py-1 rounded text-xs font-bold">{delegations.length} Total</span>
                  </div>
                  <div className="overflow-x-auto p-4">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold uppercase text-gray-500 tracking-wider">
                          <th className="p-3">Task Title</th>
                          <th className="p-3">Assigned To</th>
                          <th className="p-3">Deadline</th>
                          <th className="p-3 text-center">Status</th>
                          <th className="p-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {delegations.map(d => (
                          <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-3">
                              <p className="font-bold text-gray-800">{d.title}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5 truncate max-w-[200px]">{d.description}</p>
                            </td>
                            <td className="p-3">
                              <span className="font-semibold text-purple-600 block">{users.find(u => u.id === d.assignedToUser)?.name || d.assignedToUser}</span>
                              <span className="text-[10px] text-gray-400 uppercase">{masterSettings.roles.find(r=>r.id===d.assignedToDept)?.label || d.assignedToDept}</span>
                            </td>
                            <td className="p-3 text-xs font-medium text-gray-600">
                              {new Date(d.deadline).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                              {d.status === 'Pending' && currentTime > d.deadline && <span className="text-red-500 font-bold block text-[10px] mt-0.5">OVERDUE</span>}
                            </td>
                            <td className="p-3 text-center">
                              <span className={`px-2 py-1 rounded text-[10px] font-bold ${d.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{d.status}</span>
                            </td>
                            <td className="p-3 text-center">
                              <button onClick={() => handleDeleteDelegation(d.id)} className="text-gray-400 hover:text-red-500 p-1.5 rounded hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </td>
                          </tr>
                        ))}
                        {delegations.length === 0 && <tr><td colSpan="5" className="p-6 text-center text-gray-400">No delegations found.</td></tr>}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 2. CHECKLISTS VIEW */}
            {mdoWorkflowTab === 'checklist' && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Checklist Generator */}
                <div className="xl:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit">
                  <div className="bg-[#e67e22] px-5 py-4 flex items-center gap-3 text-white">
                    <CheckSquare className="w-5 h-5" />
                    <h2 className="font-semibold text-lg tracking-wide">Create Master Checklist Item</h2>
                  </div>
                  <form onSubmit={handleCreateChecklist} className="p-6 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Checklist Item Name <span className="text-red-500">*</span></label>
                      <input type="text" required value={newChecklist.title} onChange={e=>setNewChecklist({...newChecklist, title: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:ring-1 focus:ring-orange-400 outline-none text-sm"/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Assign To Dept <span className="text-red-500">*</span></label>
                        <select value={newChecklist.assignedToDept} onChange={e=>setNewChecklist({...newChecklist, assignedToDept: e.target.value, assignedToUser: ''})} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:ring-1 focus:ring-orange-400 outline-none text-sm font-semibold">
                          {masterSettings.roles.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Assign To Employee <span className="text-red-500">*</span></label>
                        <select required value={newChecklist.assignedToUser} onChange={e=>setNewChecklist({...newChecklist, assignedToUser: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:ring-1 focus:ring-orange-400 outline-none text-sm font-semibold text-orange-700">
                          <option value="">-- Select Employee --</option>
                          {users.filter(u => u.roles.includes(newChecklist.assignedToDept)).map(u => (
                            <option key={u.id} value={u.id}>{u.name} ({u.id})</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Frequency</label>
                        <select value={newChecklist.frequency} onChange={e=>setNewChecklist({...newChecklist, frequency: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:ring-1 focus:ring-orange-400 outline-none text-sm font-semibold">
                          <option value="Daily">Daily</option>
                          <option value="Weekly">Weekly</option>
                          <option value="Fortnightly">Fortnightly</option>
                          <option value="Monthly">Monthly</option>
                          <option value="Quarterly">Quarterly</option>
                          <option value="Half Yearly">Half Yearly</option>
                          <option value="Yearly">Yearly</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Starting From <span className="text-red-500">*</span></label>
                        <input type="date" required value={newChecklist.startDate} onChange={e=>setNewChecklist({...newChecklist, startDate: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:ring-1 focus:ring-orange-400 outline-none text-sm"/>
                      </div>
                    </div>
                    
                    {newChecklist.frequency === 'Monthly' && (
                      <div className="bg-orange-50 border border-orange-200 p-3 rounded text-sm">
                        <label className="block text-xs font-bold text-orange-800 uppercase tracking-wider mb-1">On Which Day? <span className="text-red-500">*</span></label>
                        <select value={newChecklist.monthlyDay} onChange={e=>setNewChecklist({...newChecklist, monthlyDay: e.target.value})} className="w-full px-3 py-2 bg-white border border-orange-300 rounded focus:ring-1 focus:ring-orange-500 outline-none text-sm font-semibold text-gray-700">
                          <option value="Start of the month">Start of the month</option>
                          <option value="End of the month">End of the month</option>
                          {[...Array(31)].map((_, i) => <option key={i+1} value={`${i+1}${i===0?'st':i===1?'nd':i===2?'rd':'th'} of the month`}>{i+1}</option>)}
                        </select>
                      </div>
                    )}
                    
                    <button type="submit" className="w-full bg-[#e67e22] hover:bg-[#d35400] text-white font-bold py-3 rounded-lg shadow-sm transition-colors mt-6">Add to Master Checklist</button>
                  </form>
                </div>

                {/* Checklists Manager Table */}
                <div className="xl:col-span-2 flex flex-col gap-4">
                  
                  {/* Filter Bar */}
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-wrap gap-4 items-end">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Check Schedule For Date</label>
                      <input type="date" value={checklistFilterDate} onChange={e => setChecklistFilterDate(e.target.value)} className="w-full md:w-48 px-3 py-2 bg-orange-50 border border-orange-300 rounded focus:ring-1 focus:ring-orange-500 outline-none text-sm font-semibold text-orange-800" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Filter by Dept</label>
                      <select value={checklistFilterDept} onChange={e => { setChecklistFilterDept(e.target.value); setChecklistFilterUser(''); }} className="w-full md:w-40 px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:ring-1 focus:ring-orange-400 outline-none text-sm font-semibold">
                        <option value="">All Departments</option>
                        {masterSettings.roles.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Filter by Employee</label>
                      <select value={checklistFilterUser} onChange={e => setChecklistFilterUser(e.target.value)} className="w-full md:w-40 px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:ring-1 focus:ring-orange-400 outline-none text-sm font-semibold">
                        <option value="">All Employees</option>
                        {users.filter(u => !checklistFilterDept || u.roles.includes(checklistFilterDept)).map(u => (
                          <option key={u.id} value={u.id}>{u.name} ({u.id})</option>
                        ))}
                      </select>
                    </div>
                    <button onClick={() => { setChecklistFilterDept(''); setChecklistFilterUser(''); setChecklistFilterDate(''); }} className="bg-gray-100 text-gray-600 border border-gray-200 px-3 py-2 rounded hover:bg-gray-200 transition-colors flex items-center gap-2 text-sm font-bold md:h-[38px]">
                       <FilterX className="w-4 h-4" /> Clear
                    </button>
                    <div className="md:ml-auto bg-orange-100 text-orange-800 px-4 py-2 rounded text-sm font-bold flex items-center md:h-[38px] w-full md:w-auto justify-center">
                      {filteredChecklistsOverview.length} {checklistFilterDate ? 'Tasks Due on Date' : 'Tasks Allocated'}
                    </div>
                  </div>

                  {/* Table Card */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-[#d35400] px-5 py-4 flex items-center justify-between text-white">
                      <h2 className="font-semibold text-lg tracking-wide">Routine Checklists Overview</h2>
                    </div>
                    <div className="overflow-x-auto p-4">
                      <table className="w-full text-left text-sm border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold uppercase text-gray-500 tracking-wider">
                            <th className="p-3">Item Title</th>
                            <th className="p-3">Assigned To</th>
                            <th className="p-3">Schedule</th>
                            <th className="p-3 text-center">Current Status</th>
                            <th className="p-3 text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredChecklistsOverview.map(c => (
                            <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="p-3 font-bold text-gray-800">{c.title}</td>
                              <td className="p-3">
                                <span className="font-semibold text-orange-600 block">{users.find(u => u.id === c.assignedToUser)?.name || c.assignedToUser}</span>
                                <span className="text-[10px] text-gray-400 uppercase">{masterSettings.roles.find(r=>r.id===c.assignedToDept)?.label || c.assignedToDept}</span>
                              </td>
                              <td className="p-3">
                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold border border-gray-200 uppercase inline-block mb-1">{c.frequency}</span>
                                {c.frequency === 'Monthly' && <span className="block text-[10px] font-semibold text-orange-500">{c.monthlyDay}</span>}
                                <span className="block text-[10px] text-gray-500 mt-1 font-medium">Starts: {new Date(c.startDate).toLocaleDateString()}</span>
                              </td>
                              <td className="p-3 text-center">
                                <span className={`px-2 py-1 rounded text-[10px] font-bold ${c.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{c.status}</span>
                              </td>
                              <td className="p-3 text-center">
                                <button onClick={() => handleDeleteChecklist(c.id)} className="text-gray-400 hover:text-red-500 p-1.5 rounded hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                              </td>
                            </tr>
                          ))}
                          {filteredChecklistsOverview.length === 0 && <tr><td colSpan="5" className="p-6 text-center text-gray-400">No checklists found for these filters.</td></tr>}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. FORMS MASTER VIEW */}
            {mdoWorkflowTab === 'forms' && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-fit">
                  <div className="bg-[#2ecc71] px-5 py-4 flex items-center gap-3 text-white">
                    <FileQuestion className="w-5 h-5" />
                    <h2 className="font-semibold text-lg tracking-wide">Create New Form Master</h2>
                  </div>
                  <form onSubmit={handleSaveFormMaster} className="p-6">
                    <div className="mb-4">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Form Title <span className="text-red-500">*</span></label>
                      <input type="text" required value={newFormMaster.title} onChange={e=>setNewFormMaster({...newFormMaster, title: e.target.value})} placeholder="e.g. QC Dispatch Checks" className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:ring-1 focus:ring-green-400 outline-none text-sm"/>
                    </div>
                    
                    <div className="space-y-3">
                       <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider border-b pb-1">Form Fields</label>
                       {newFormMaster.fields.map((field, idx) => (
                         <div key={field.id} className="flex gap-2 items-center bg-gray-50 p-2 rounded border border-gray-200">
                           <input type="text" required placeholder="Question / Label" value={field.label} onChange={(e) => {
                             const newFields = [...newFormMaster.fields];
                             newFields[idx].label = e.target.value;
                             setNewFormMaster({...newFormMaster, fields: newFields});
                           }} className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-xs outline-none focus:border-green-400"/>
                           
                           <select value={field.type} onChange={(e) => {
                             const newFields = [...newFormMaster.fields];
                             newFields[idx].type = e.target.value;
                             setNewFormMaster({...newFormMaster, fields: newFields});
                           }} className="w-28 px-2 py-1.5 border border-gray-300 rounded text-xs outline-none focus:border-green-400 font-semibold text-gray-600">
                              <option value="Text">Text</option>
                              <option value="Number">Number</option>
                              <option value="Yes/No">Yes/No</option>
                           </select>

                           <button type="button" onClick={() => {
                             if(newFormMaster.fields.length > 1) {
                               setNewFormMaster({...newFormMaster, fields: newFormMaster.fields.filter((_, i) => i !== idx)});
                             }
                           }} className="text-red-400 hover:text-red-600 p-1"><Trash2 className="w-4 h-4"/></button>
                         </div>
                       ))}
                       <button type="button" onClick={() => setNewFormMaster({...newFormMaster, fields: [...newFormMaster.fields, { id: Date.now().toString(), label: '', type: 'Text' }]})} className="text-green-600 text-xs font-bold flex items-center gap-1 hover:bg-green-50 p-1.5 rounded transition-colors">
                         <Plus className="w-3 h-3"/> Add Question Field
                       </button>
                    </div>
                    <button type="submit" className="w-full bg-[#2ecc71] hover:bg-[#27ae60] text-white font-bold py-3 rounded-lg shadow-sm transition-colors mt-6">Save Form Template</button>
                  </form>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                   <div className="bg-[#27ae60] px-5 py-4 flex items-center justify-between text-white">
                      <h2 className="font-semibold text-lg tracking-wide">Available Form Templates</h2>
                   </div>
                   <div className="p-4 space-y-4">
                      {formMasters.map(form => (
                        <div key={form.id} className="border border-gray-200 rounded-lg p-4 shadow-sm bg-gray-50/50">
                           <div className="flex justify-between items-start mb-3 border-b border-gray-200 pb-2">
                              <h3 className="font-bold text-gray-800">{form.title}</h3>
                              <button onClick={() => handleDeleteFormMaster(form.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                           </div>
                           <div className="space-y-1.5">
                              {form.fields.map((f, i) => (
                                <div key={f.id} className="text-xs flex gap-2">
                                   <span className="font-mono text-gray-400">{i+1}.</span>
                                   <span className="font-medium text-gray-700">{f.label}</span>
                                   <span className="ml-auto bg-gray-200 text-gray-600 px-1.5 rounded text-[10px] font-bold">{f.type}</span>
                                </div>
                              ))}
                           </div>
                        </div>
                      ))}
                      {formMasters.length === 0 && <p className="text-center text-gray-400 text-sm py-4">No form templates created yet.</p>}
                   </div>
                </div>
              </div>
            )}

            {/* 4. FLOWCHART VIEW */}
            {mdoWorkflowTab === 'flowchart' && (
              <div className="space-y-6">
                
                {/* Header Actions */}
                <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                   <div>
                     <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2"><Layers className="w-5 h-5 text-blue-600"/> Automated Flowcharts</h3>
                     <p className="text-sm text-gray-500 mt-0.5">Design multi-step pipelines defining What, Who, How, and TAT for tasks.</p>
                   </div>
                   <button onClick={() => {
                     if (showPipelineBuilder) {
                       setShowPipelineBuilder(false);
                       setEditingPipelineId(null);
                       setNewPipeline({ name: '', trigger: 'Manual', steps: [{ id: Date.now().toString(), title: '', assignedToDept: 'crm', assignedToUser: 'ROUND_ROBIN', how: '', tatMinutes: 60, requiresChecklist: false, checklistItems: [''], requiresForm: false, attachedFormId: '' }] });
                     } else {
                       setShowPipelineBuilder(true);
                     }
                   }} className={`px-4 py-2 font-bold text-sm rounded-lg transition-colors shadow-sm ${showPipelineBuilder ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                     {showPipelineBuilder ? 'View Live Monitor' : '+ Build New Flowchart'}
                   </button>
                </div>

                {showPipelineBuilder ? (
                  /* PIPELINE BUILDER UI */
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-[#2c3e50] px-5 py-4 text-white">
                      <h2 className="font-semibold text-lg tracking-wide">{editingPipelineId ? 'Edit Flowchart' : 'Flowchart Builder'}</h2>
                      <p className="text-xs text-gray-300 mt-1">Define the sequence of tasks. When the trigger occurs, the system will automatically manage handovers and TATs.</p>
                    </div>
                    <form onSubmit={handleSavePipeline} className="p-6">
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Flowchart Name <span className="text-red-500">*</span></label>
                          <input type="text" required value={newPipeline.name} onChange={e=>setNewPipeline({...newPipeline, name: e.target.value})} placeholder="e.g., Damaged Return Processing" className="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none text-sm"/>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">System Trigger <span className="text-red-500">*</span></label>
                          <select value={newPipeline.trigger} onChange={e=>setNewPipeline({...newPipeline, trigger: e.target.value})} className="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none text-sm font-semibold text-blue-700">
                            <option value="Manual">Manual Trigger (Triggered by MDO anytime)</option>
                            <option value="Order Generation (Default)">On New Order Generation (Standard)</option>
                            {masterSettings.customizationTypes.map(ct => (
                               <option key={ct} value={`Order Generation (Customisation: ${ct})`}>
                                  On Order Gen. (Customisation: {ct})
                               </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <h3 className="font-bold text-gray-700 border-b border-gray-200 pb-2 mb-4">Pipeline Steps (The Sequence)</h3>
                      
                      <div className="space-y-4">
                        {newPipeline.steps.map((step, index) => (
                          <div key={step.id} className="relative bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                            <div className="absolute -left-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center font-black text-xs shadow-md border-2 border-white">
                              {index + 1}
                            </div>
                            
                            <div className="flex justify-between items-start mb-3 ml-2">
                              <h4 className="font-bold text-blue-800 text-sm">Step {index + 1} Configuration</h4>
                              <button type="button" onClick={() => handleRemovePipelineStep(step.id)} className="text-gray-400 hover:text-red-500 transition-colors" title="Remove Step"><Trash2 className="w-4 h-4"/></button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 ml-2">
                              <div className="md:col-span-3">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">1. WHAT (Task Name) <span className="text-red-500">*</span></label>
                                <input type="text" required value={step.title} onChange={e=>handleUpdatePipelineStep(step.id, 'title', e.target.value)} placeholder="e.g., Verify Stock" className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:ring-1 focus:ring-blue-400 outline-none text-sm"/>
                              </div>
                              <div className="md:col-span-3">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">2. WHO (Assigned Dept) <span className="text-red-500">*</span></label>
                                <select required value={step.assignedToDept} onChange={e=>{ handleUpdatePipelineStep(step.id, 'assignedToDept', e.target.value); handleUpdatePipelineStep(step.id, 'assignedToUser', 'ROUND_ROBIN'); }} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:ring-1 focus:ring-blue-400 outline-none text-sm font-semibold">
                                  {masterSettings.roles.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                                </select>
                              </div>
                              <div className="md:col-span-3">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">3. WHO (Specific Employee) <span className="text-red-500">*</span></label>
                                <select required value={step.assignedToUser} onChange={e=>handleUpdatePipelineStep(step.id, 'assignedToUser', e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:ring-1 focus:ring-blue-400 outline-none text-sm font-semibold text-blue-700">
                                  <option value="ROUND_ROBIN">Auto-Assign (Round Robin)</option>
                                  {users.filter(u => u.roles.includes(step.assignedToDept)).map(u => (
                                    <option key={u.id} value={u.id}>{u.name} ({u.id})</option>
                                  ))}
                                </select>
                              </div>
                              <div className="md:col-span-3">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">4. TAT (Minutes allowed) <span className="text-red-500">*</span></label>
                                <input type="number" required min="1" value={step.tatMinutes} onChange={e=>handleUpdatePipelineStep(step.id, 'tatMinutes', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:ring-1 focus:ring-blue-400 outline-none text-sm font-mono"/>
                              </div>
                              <div className="md:col-span-12">
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">5. HOW (Instructions / SOP) <span className="text-red-500">*</span></label>
                                <textarea required rows="2" value={step.how} onChange={e=>handleUpdatePipelineStep(step.id, 'how', e.target.value)} placeholder="Explain exactly how the assigned department should complete this step..." className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:ring-1 focus:ring-blue-400 outline-none text-sm resize-none"></textarea>
                              </div>
                              
                              <div className="md:col-span-12 mt-2 border-t border-gray-100 pt-3 flex flex-wrap gap-8">
                                <label className="flex items-center gap-2 cursor-pointer mb-2">
                                  <input type="checkbox" checked={step.requiresChecklist} onChange={(e) => handleUpdatePipelineStep(step.id, 'requiresChecklist', e.target.checked)} className="accent-blue-600 w-4 h-4" />
                                  <span className="text-sm font-bold text-gray-700">Checklist Required?</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer mb-2">
                                  <input type="checkbox" checked={step.requiresForm} onChange={(e) => handleUpdatePipelineStep(step.id, 'requiresForm', e.target.checked)} className="accent-blue-600 w-4 h-4" />
                                  <span className="text-sm font-bold text-gray-700">Attach Data Form?</span>
                                </label>
                              </div>
                                
                              <div className="md:col-span-12 space-y-4">
                                {step.requiresChecklist && (
                                   <div className="space-y-2 bg-blue-50/50 p-3 rounded border border-blue-100">
                                      <label className="block text-xs font-bold text-blue-800 uppercase tracking-wider">Sub-Task Checklist</label>
                                      {step.checklistItems.map((item, idx) => (
                                         <div key={idx} className="flex gap-2">
                                            <input type="text" value={item} onChange={e => {
                                               const newItems = [...step.checklistItems];
                                               newItems[idx] = e.target.value;
                                               handleUpdatePipelineStep(step.id, 'checklistItems', newItems);
                                            }} placeholder={`Checklist Item ${idx + 1}`} className="flex-1 text-sm p-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-400 outline-none" />
                                            <button type="button" onClick={() => {
                                               const newItems = step.checklistItems.filter((_, i) => i !== idx);
                                               handleUpdatePipelineStep(step.id, 'checklistItems', newItems);
                                            }} className="text-red-500 hover:bg-red-50 p-1.5 rounded"><Trash2 className="w-4 h-4"/></button>
                                         </div>
                                      ))}
                                      <button type="button" onClick={() => {
                                         handleUpdatePipelineStep(step.id, 'checklistItems', [...step.checklistItems, '']);
                                      }} className="text-blue-600 text-xs font-bold flex items-center gap-1 hover:bg-blue-100 p-1.5 rounded transition-colors mt-2">
                                        <Plus className="w-3 h-3"/> Add Checklist Item
                                      </button>
                                   </div>
                                )}

                                {step.requiresForm && (
                                  <div className="bg-purple-50/50 p-3 rounded border border-purple-100">
                                     <label className="block text-xs font-bold text-purple-800 uppercase tracking-wider mb-2">Select Form Master <span className="text-red-500">*</span></label>
                                     <select value={step.attachedFormId} onChange={e=>handleUpdatePipelineStep(step.id, 'attachedFormId', e.target.value)} className="w-full px-3 py-2 bg-white border border-purple-300 rounded focus:ring-1 focus:ring-purple-500 outline-none text-sm font-semibold">
                                        <option value="">-- Select a Form Template --</option>
                                        {formMasters.map(f => <option key={f.id} value={f.id}>{f.title}</option>)}
                                     </select>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex gap-4 border-t border-gray-200 pt-6">
                        <button type="button" onClick={handleAddPipelineStep} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 font-bold py-3 rounded-lg shadow-sm transition-colors flex justify-center items-center gap-2">
                          <Plus className="w-4 h-4"/> Add Next Step
                        </button>
                        <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-md transition-colors flex justify-center items-center gap-2">
                          <Save className="w-4 h-4"/> Save Flowchart
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  /* LIVE MONITOR & EXISTING PIPELINES */
                  <>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                      <h3 className="font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4">Configured Flowcharts (Master List)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {pipelines.map(pipeline => (
                          <div key={pipeline.id} className="border border-blue-100 bg-blue-50/30 p-4 rounded-lg">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="font-bold text-blue-900 text-sm">{pipeline.name}</h4>
                              <div className="flex gap-2">
                                <button onClick={() => handleEditPipeline(pipeline)} className="text-blue-500 hover:text-blue-700 bg-white p-1 rounded shadow-sm border border-blue-200" title="Edit"><Edit className="w-3.5 h-3.5" /></button>
                                <button onClick={() => handleDeletePipeline(pipeline.id)} className="text-red-400 hover:text-red-600 bg-white p-1 rounded shadow-sm border border-red-100" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                              </div>
                            </div>
                            <div className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold uppercase inline-block mb-3">Trigger: {pipeline.trigger}</div>
                            <div className="text-xs text-gray-600 space-y-1">
                              {pipeline.steps.map((s, idx) => (
                                <div key={s.id} className="flex gap-2 items-start">
                                  <span className="font-mono text-[10px] mt-0.5 text-gray-400">{idx+1}.</span>
                                  <span className="truncate">{s.title} ({s.assignedToUser === 'ROUND_ROBIN' ? 'Auto-Assign' : (users.find(u=>u.id===s.assignedToUser)?.name || s.assignedToUser)} - {masterSettings.roles.find(r=>r.id===s.assignedToDept)?.label || s.assignedToDept})</span>
                                </div>
                              ))}
                            </div>
                            {pipeline.trigger === 'Manual' && (
                              <button onClick={() => handleTriggerManualPipeline(pipeline.id)} className="w-full mt-4 bg-white border border-blue-300 text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded text-xs font-bold transition-colors">
                                Trigger Flowchart Now
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                      <div className="bg-blue-600 px-5 py-4 flex items-center justify-between text-white">
                        <h2 className="font-semibold text-lg tracking-wide">Live Global Flowchart Monitor</h2>
                        <span className="bg-white/20 px-3 py-1 rounded text-xs font-bold">{flowchartTasks.length} Active in Pipeline</span>
                      </div>
                      <div className="overflow-x-auto p-4">
                        <table className="w-full text-left text-sm border-collapse">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold uppercase text-gray-500 tracking-wider">
                              <th className="p-3">Pipeline Context</th>
                              <th className="p-3">Current Active Step</th>
                              <th className="p-3">Assigned To</th>
                              <th className="p-3 text-center">TAT Clock</th>
                              <th className="p-3 text-center">Global Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {flowchartTasks.map(f => {
                              const parentPipeline = pipelines.find(p => p.id === f.pipelineId);
                              return (
                                <tr key={f.id} className="border-b border-gray-100 hover:bg-blue-50/30">
                                  <td className="p-3">
                                    <span className="font-bold text-gray-800">{parentPipeline ? parentPipeline.name : 'Legacy Task'}</span>
                                    <span className="block text-[10px] text-gray-500 mt-0.5 font-medium">{f.customerName}</span>
                                  </td>
                                  <td className="p-3">
                                    <span className="font-bold text-blue-700">{f.title}</span>
                                    <span className="block text-[10px] text-gray-500 mt-0.5 truncate max-w-xs">{f.details}</span>
                                  </td>
                                  <td className="p-3">
                                    <span className="font-semibold text-blue-600 block">{users.find(u => u.id === f.assignedToUser)?.name || f.assignedToUser}</span>
                                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-[10px] font-bold border border-blue-200 uppercase tracking-wider mt-1 inline-block">
                                      {masterSettings.roles.find(r=>r.id===f.stage)?.label || f.stage}
                                    </span>
                                  </td>
                                  <td className="p-3 text-center">
                                    {f.status === 'Completed' ? (
                                      <span className="text-gray-400 font-bold text-xs">-</span>
                                    ) : (
                                      formatTAT(f.startTime, f.tatMinutes)
                                    )}
                                  </td>
                                  <td className="p-3 text-center">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${f.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700 animate-pulse'}`}>{f.status}</span>
                                  </td>
                                </tr>
                              )
                            })}
                            {flowchartTasks.length === 0 && <tr><td colSpan="5" className="p-6 text-center text-gray-400">No active workflows moving through the pipeline.</td></tr>}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

          </div>
        )}

        {/* --- ALL OTHER EXISTING TABS BELOW --- */}
        
        {/* --- TAB: ORDER GENERATION --- */}
        {activeTab === 'order' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-1 space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-visible relative">
                <div className="bg-[#3498db] px-4 py-3 flex justify-between items-center text-white rounded-t-lg"><h2 className="font-semibold text-sm tracking-wide">1. Select Customer</h2><Search className="w-4 h-4 text-white/80" /></div>
                <div className="p-5">
                  <div className="relative">
                    <input type="text" placeholder="Search ID, Name, Mobile, KYC..." className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:border-[#3498db] focus:ring-1 focus:ring-[#3498db] transition-all text-sm" value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value.toUpperCase()); setIsSearching(true); }} onFocus={() => setIsSearching(true)} />
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                  {isSearching && searchResults.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-xl max-h-60 overflow-y-auto left-0">
                      {searchResults.map(customer => (
                        <div key={customer.id} onClick={() => handleSelectCustomer(customer)} className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0">
                          <div className="font-bold text-gray-800 text-sm flex justify-between items-center">{customer.name}{customer.status === 'Not Working' && <span className="w-2 h-2 rounded-full bg-red-500" title="Not Working"></span>}</div>
                          <div className="text-xs text-gray-500 flex gap-4 mt-1 font-medium"><span>{customer.id}</span><span>{customer.phone}</span></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {selectedCustomer && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative">
                  <div className="bg-[#2ecc71] px-4 py-3 flex justify-between items-center text-white rounded-t-lg"><h2 className="font-semibold text-sm tracking-wide">Customer Selected</h2><button onClick={handleClearCustomer} className="text-white hover:text-green-900 transition-colors" title="Clear Order"><Trash2 className="w-4 h-4" /></button></div>
                  <div className="p-5">
                    {selectedCustomer.status === 'Not Working' && (
                      <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-xs font-bold flex flex-col gap-1"><div className="flex items-center gap-1.5"><AlertOctagon className="w-4 h-4" /> WARNING: CUSTOMER NOT WORKING</div><div className="text-red-500 font-medium pl-5">{selectedCustomer.statusRemark}</div></div>
                    )}
                    <div className="flex justify-between items-start">
                      <div><h3 className="text-lg font-bold text-[#1a1d2d]">{selectedCustomer.name}</h3><p className="text-gray-500 text-sm mt-0.5">{selectedCustomer.id} • +91 {selectedCustomer.phone}</p></div>
                      <div className="flex flex-col gap-1 items-end">
                        {selectedCustomer.customerType && <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded border border-indigo-100 uppercase tracking-wider">{selectedCustomer.customerType}</span>}
                        {selectedCustomer.agentName && selectedCustomer.agentName !== 'DIRECT' && <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">AGENT: {selectedCustomer.agentName}</span>}
                      </div>
                    </div>
                    {selectedCustomer.kycNumber && <p className="text-gray-600 text-sm mt-2 font-mono text-xs border bg-gray-50 inline-block px-1.5 py-0.5 rounded">{selectedCustomer.kycType || 'ID'}: {selectedCustomer.kycNumber}</p>}
                    <p className="text-gray-600 text-sm mt-2">{selectedCustomer.address}</p>
                    {selectedCustomer.paymentDays > 0 && (
                      <div className="flex gap-3 mt-2 text-xs font-medium text-gray-500">
                        <span><span className="text-gray-400">Credit:</span> {selectedCustomer.paymentDays} Days</span>
                      </div>
                    )}
                    <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
                      <div><p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Rate List</p><div className="font-bold text-gray-800 text-sm">{selectedCustomer.rateList}</div></div>
                      {selectedCustomer.discount > 0 && <div><p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Discount</p><div className="font-bold text-green-600 text-sm">{selectedCustomer.discount}% Off</div></div>}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="xl:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-[#e74c3c] px-4 py-3 flex justify-between items-center text-white rounded-t-lg"><h2 className="font-semibold text-sm tracking-wide flex items-center gap-2">Order Formulation {!selectedCustomer && <AlertCircle className="w-4 h-4" />}</h2><div className="font-bold text-xs bg-black/20 px-2 py-1 rounded">Order No: {currentOrderDisplayNo}</div></div>
                <div className="p-5 overflow-x-auto">
                  {!selectedCustomer ? (
                    <div className="text-center py-10 text-gray-400 bg-gray-50/50 rounded-md border border-dashed border-gray-200"><Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />Please select a customer on the left to apply correct rates.</div>
                  ) : (
                    <>
                      <div className="mb-4 flex flex-wrap items-center gap-4 bg-red-50/50 p-3 rounded-lg border border-red-100">
                         <div className="flex items-center gap-2">
                           <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Customisation Required?</label>
                           <select className="border border-red-300 rounded px-2 py-1.5 text-xs font-bold text-red-700 outline-none focus:ring-1 focus:ring-red-400 bg-white"
                             value={globalCustomization}
                             onChange={(e) => {
                               setGlobalCustomization(e.target.value);
                               if (e.target.value === 'No') {
                                 setGlobalCustomizationType('');
                                 setOrderLines(orderLines.map(l => ({ ...l, isCustomized: 'No' })));
                               }
                             }}
                           >
                             <option value="No">No</option>
                             <option value="Yes">Yes</option>
                           </select>
                         </div>
                         {globalCustomization === 'Yes' && (
                           <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Type:</label>
                              <select className="border border-red-300 rounded px-2 py-1.5 text-xs font-bold text-red-700 outline-none focus:ring-1 focus:ring-red-400 bg-white"
                                value={globalCustomizationType} onChange={(e) => setGlobalCustomizationType(e.target.value)} required
                              >
                                <option value="">-- Select Type --</option>
                                {masterSettings.customizationTypes.map(ct => <option key={ct} value={ct}>{ct}</option>)}
                              </select>
                           </div>
                         )}
                      </div>

                      <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                          <tr className="text-[10px] font-bold uppercase text-gray-400 border-b border-gray-200 tracking-wider">
                            <th className="pb-3 w-10 text-center">#</th>
                            <th className="pb-3 w-1/2 min-w-[200px]">Item Description</th>
                            <th className="pb-3 w-20">Qty</th>
                            <th className="pb-3 w-28 text-right">Base Rate</th>
                            {globalCustomization === 'Yes' && <th className="pb-3 w-24 text-center">Customise</th>}
                            <th className="pb-3 w-32 text-right">Total (₹)</th>
                            <th className="pb-3 w-12 text-center"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {orderLines.map((line, index) => (
                            <tr key={line.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                              <td className="py-3 text-center text-gray-400 font-bold text-xs">{index + 1}.</td>
                              <td className="py-3 pr-3 relative"><SearchableItemSelect items={items} value={line.itemId} onChange={(val) => updateOrderLine(line.id, 'itemId', val)} /></td>
                              <td className="py-3 pr-3"><input type="number" min="1" className="w-full bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded focus:ring-1 focus:ring-[#e74c3c] focus:border-[#e74c3c] block p-2 outline-none" value={line.quantity} onChange={(e) => updateOrderLine(line.id, 'quantity', parseInt(e.target.value) || 0)} /></td>
                              <td className="py-3 pr-3"><div className="relative"><span className="absolute left-2.5 top-2 text-gray-400 font-medium text-sm">₹</span><input type="number" className="w-full pl-6 pr-2 bg-gray-100 border border-gray-200 text-gray-500 text-sm rounded block p-2 cursor-not-allowed font-medium text-right" value={line.rate} readOnly /></div></td>
                              {globalCustomization === 'Yes' && (
                                <td className="py-3 pr-3 text-center">
                                  <select className={`border text-xs rounded block p-1.5 outline-none mx-auto font-bold ${line.isCustomized === 'Yes' ? 'bg-red-50 border-red-300 text-red-600' : 'bg-gray-50 border-gray-300 text-gray-600'}`}
                                    value={line.isCustomized || 'No'}
                                    onChange={(e) => updateOrderLine(line.id, 'isCustomized', e.target.value)}
                                  >
                                    <option value="No">No</option>
                                    <option value="Yes">Yes</option>
                                  </select>
                                </td>
                              )}
                              <td className="py-3 pr-3 text-right font-bold text-gray-800 text-sm">₹{(line.quantity * (line.rate || 0)).toFixed(2)}</td>
                              <td className="py-3 text-center"><button onClick={() => removeOrderLine(line.id)} className="text-gray-400 hover:text-red-500 p-1.5 rounded hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <button onClick={addOrderLine} className="mt-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 font-bold text-[11px] uppercase tracking-wider px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded transition-colors"><Plus className="w-3 h-3" /> Add Row</button>
                    </>
                  )}
                </div>
              </div>

              {selectedCustomer && orderLines.length > 0 && orderLines[0].itemId !== '' && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-[#2c3e50] px-4 py-3 flex justify-between items-center text-white rounded-t-lg"><h2 className="font-semibold text-sm tracking-wide flex items-center gap-2">Final Summary</h2></div>
                  <div className="p-5 flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="w-full md:w-1/2 space-y-2 font-medium text-sm">
                      <div className="flex justify-between text-gray-500"><span>Item Subtotal</span><span className="font-bold text-gray-800">₹{calculations.baseSubtotal.toFixed(2)}</span></div>
                      <div className="flex justify-between items-center text-gray-700"><span>Customization (₹)</span><input type="number" className="w-24 text-right bg-purple-50 border border-purple-200 text-gray-800 text-sm rounded focus:ring-1 focus:ring-purple-400 p-1 outline-none font-bold" value={customizationCharges || ''} onChange={(e) => setCustomizationCharges(e.target.value)} placeholder="0" /></div>
                      {calculations.discountPercent > 0 && calculations.discountAmount > 0.01 && <div className="flex justify-between text-green-600"><span>Discount ({calculations.discountPercent}%)</span><span>- ₹{calculations.discountAmount.toFixed(2)}</span></div>}
                      <div className="flex justify-between items-center text-gray-700"><span>Packing Charges (₹)</span><input type="number" className="w-24 text-right bg-blue-50 border border-blue-200 text-gray-800 text-sm rounded focus:ring-1 focus:ring-blue-400 p-1 outline-none font-bold" value={packingCharges || ''} onChange={(e) => setPackingCharges(e.target.value)} placeholder="0" /></div>
                      
                      <div className="flex justify-between items-center text-gray-700">
                        <span>Transport</span>
                        <select className="w-32 md:w-40 text-right bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded focus:ring-1 focus:ring-blue-400 p-1 outline-none font-bold" value={orderTransport} onChange={(e) => setOrderTransport(e.target.value)}>
                          <option value="">-- Select --</option>
                          {masterSettings.transports.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                        </select>
                      </div>
                      
                      <div className="flex justify-between items-center text-gray-700">
                        <span>CC Attached?</span>
                        <select className="w-24 text-right bg-gray-50 border border-gray-300 text-gray-800 text-sm rounded focus:ring-1 focus:ring-blue-400 p-1 outline-none font-bold" value={ccAttached} onChange={(e) => setCcAttached(e.target.value)}>
                          <option value="No">No</option>
                          <option value="Yes">Yes</option>
                        </select>
                      </div>

                      <div className="flex justify-between text-gray-500"><span>GST (5%)</span><span className="font-bold text-gray-800">+ ₹{calculations.gstAmount.toFixed(2)}</span></div>
                      {Math.abs(calculations.roundOff) > 0.01 && <div className="flex justify-between text-gray-400 text-xs"><span>Round Off</span><span>{calculations.roundOff > 0 ? '+' : ''}₹{calculations.roundOff.toFixed(2)}</span></div>}
                      <div className="flex justify-between text-xl font-black text-[#1a1d2d] pt-2 border-t border-gray-200 mt-2"><span>Grand Total</span><span className="text-[#e74c3c]">₹{calculations.grandTotal.toFixed(2)}</span></div>
                    </div>
                    <div className="flex flex-col gap-3 w-full md:w-auto self-end">
                      <button onClick={sendWhatsApp} className="w-full px-6 py-2.5 bg-[#25D366] hover:bg-[#20b858] text-white rounded font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm"><Send className="w-4 h-4" /> WhatsApp</button>
                      <div className="flex gap-3">
                        <button onClick={() => handlePrint(null)} className="w-full px-4 py-2.5 bg-white border border-gray-300 text-gray-700 hover:text-[#3498db] hover:border-[#3498db] rounded font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm"><Printer className="w-4 h-4" /> Print</button>
                        <button onClick={handleSaveOrder} className="w-full px-4 py-2.5 bg-[#2c3e50] text-white hover:bg-[#1a252f] rounded font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm"><Save className="w-4 h-4" /> {editingOrderId ? 'Update' : 'Save & Push to OP'}</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- TAB: CUSTOMER ONBOARDING --- */}
        {activeTab === 'onboarding' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-[#2ecc71] px-5 py-4 flex items-center justify-between gap-3 text-white rounded-t-lg">
              <div className="flex items-center gap-3"><UserCheck className="w-5 h-5" /><h2 className="font-semibold text-lg tracking-wide">{editingCustomerId ? `Edit CRM Profile: ${editingCustomerId}` : 'Client Registration Form'}</h2></div>
              {editingCustomerId && <div className="bg-white/20 px-3 py-1 rounded text-xs font-bold shadow-sm uppercase tracking-wider">Update Mode</div>}
            </div>
            
            <form onSubmit={handleOnboardingSubmit} className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                {/* Section 1: Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b pb-2 mb-3">Basic Info & KYC</h3>
                  <div><label className="block text-sm font-semibold text-gray-700 mb-1">Firm/Customer Name <span className="text-red-500">*</span></label><input type="text" required placeholder="e.g. M/S SHARMA CLOTH" className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded outline-none focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71] text-sm" value={onboardingForm.name} onChange={(e) => setOnboardingForm({...onboardingForm, name: e.target.value.toUpperCase()})} /></div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Customer Status</label>
                    <div className="flex gap-4 mt-2">
                      <label className="flex items-center gap-2 cursor-pointer text-sm font-medium"><input type="radio" name="status" value="Working" checked={onboardingForm.status === 'Working'} onChange={(e) => setOnboardingForm({...onboardingForm, status: e.target.value})} className="accent-[#2ecc71]" /><span className="text-green-600">Working</span></label>
                      <label className="flex items-center gap-2 cursor-pointer text-sm font-medium"><input type="radio" name="status" value="Not Working" checked={onboardingForm.status === 'Not Working'} onChange={(e) => setOnboardingForm({...onboardingForm, status: e.target.value, statusRemark: ''})} className="accent-red-500" /><span className="text-red-500">Not Working</span></label>
                    </div>
                  </div>
                  {onboardingForm.status === 'Not Working' && (
                    <div><label className="block text-sm font-semibold text-red-600 mb-1">Reason for Not Working <span className="text-red-500">*</span></label><input type="text" required placeholder="e.g. PAYMENT ISSUE" className="w-full px-3 py-2 bg-red-50 border border-red-300 rounded outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm" value={onboardingForm.statusRemark} onChange={(e) => setOnboardingForm({...onboardingForm, statusRemark: e.target.value.toUpperCase()})} /></div>
                  )}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Customer Type</label>
                    <select className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded outline-none focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71] text-sm" value={onboardingForm.customerType} onChange={(e) => setOnboardingForm({...onboardingForm, customerType: e.target.value})}>
                      <option value="">-- Select Type --</option>{masterSettings.customerTypes.map(ct => <option key={ct} value={ct}>{ct}</option>)}
                    </select>
                  </div>
                  {onboardingForm.customerType !== 'END CONSUMER' && (
                    <>
                      <div className="grid grid-cols-[100px_1fr] gap-2">
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1">ID Type</label><select className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded outline-none focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71] text-sm" value={onboardingForm.kycType} onChange={(e) => setOnboardingForm({...onboardingForm, kycType: e.target.value})}><option value="GST">GST</option><option value="PAN">PAN</option><option value="Aadhar">Aadhar</option></select></div>
                        <div><label className="block text-sm font-semibold text-gray-700 mb-1">ID Number</label><input type="text" placeholder={`Enter ${onboardingForm.kycType}...`} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded outline-none focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71] text-sm font-mono" value={onboardingForm.kycNumber} onChange={(e) => setOnboardingForm({...onboardingForm, kycNumber: e.target.value.toUpperCase()})} /></div>
                      </div>
                      {(onboardingForm.kycType === 'PAN' || onboardingForm.kycType === 'Aadhar') && (
                        <div className="mt-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
                           <label className="block text-xs font-bold text-gray-700 mb-1">Upload {onboardingForm.kycType} Photo <span className="text-red-500">*</span></label>
                           <label className="flex items-center gap-2 w-full px-3 py-2 bg-white border border-gray-300 rounded cursor-pointer text-sm hover:bg-gray-50 transition-colors"><FileUp className="w-4 h-4 text-blue-600" /><span className="truncate text-gray-500">{onboardingForm.idPhotoFileName || 'Choose image file...'}</span><input type="file" accept="image/*" className="hidden" onChange={(e) => setOnboardingForm({...onboardingForm, idPhotoFileName: e.target.files[0]?.name || ''})} /></label>
                        </div>
                      )}
                      <div className="pt-2 border-t border-gray-100 mt-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Is KYC Document Signed?</label>
                        <div className="flex gap-4 mt-2 mb-3">
                          <label className="flex items-center gap-2 cursor-pointer text-sm"><input type="radio" name="kycSigned" value="Yes" checked={onboardingForm.kycSigned === 'Yes'} onChange={(e) => setOnboardingForm({...onboardingForm, kycSigned: e.target.value})} className="accent-[#2ecc71]" />Yes</label>
                          <label className="flex items-center gap-2 cursor-pointer text-sm"><input type="radio" name="kycSigned" value="No" checked={onboardingForm.kycSigned === 'No'} onChange={(e) => setOnboardingForm({...onboardingForm, kycSigned: e.target.value})} className="accent-[#2ecc71]" />No</label>
                        </div>
                        {onboardingForm.kycSigned === 'Yes' && (
                          <div className="space-y-3 bg-green-50 p-3 rounded-lg border border-green-100">
                            <div><label className="block text-xs font-bold text-gray-700 mb-1">Upload KYC Document (PDF) <span className="text-red-500">*</span></label><label className="flex items-center gap-2 w-full px-3 py-2 bg-white border border-gray-300 rounded cursor-pointer text-sm hover:bg-gray-50"><FileUp className="w-4 h-4 text-green-600" /><span className="truncate text-gray-500">{onboardingForm.kycFileName || 'Choose PDF file...'}</span><input type="file" accept=".pdf" className="hidden" onChange={(e) => setOnboardingForm({...onboardingForm, kycFileName: e.target.files[0]?.name || ''})} /></label></div>
                            <div><label className="block text-xs font-bold text-gray-700 mb-1">Upload Cheque Photo (Optional)</label><label className="flex items-center gap-2 w-full px-3 py-2 bg-white border border-gray-300 rounded cursor-pointer text-sm hover:bg-gray-50"><FileCheck className="w-4 h-4 text-blue-500" /><span className="truncate text-gray-500">{onboardingForm.chequeFileName || 'Choose image file...'}</span><input type="file" accept="image/*" className="hidden" onChange={(e) => setOnboardingForm({...onboardingForm, chequeFileName: e.target.files[0]?.name || ''})} /></label></div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Section 2: Contact Details */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b pb-2 mb-3">Contact Details</h3>
                  <div><label className="block text-sm font-semibold text-gray-700 mb-1">Mobile No. 1 <span className="text-red-500">*</span></label><input type="tel" required placeholder="Primary Number" className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded outline-none focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71] text-sm" value={onboardingForm.mobile1} onChange={(e) => setOnboardingForm({...onboardingForm, mobile1: e.target.value.toUpperCase()})} /></div>
                  <div><label className="block text-sm font-semibold text-gray-700 mb-1">Mobile No. 2</label><input type="tel" placeholder="Secondary Number" className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded outline-none focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71] text-sm" value={onboardingForm.mobile2} onChange={(e) => setOnboardingForm({...onboardingForm, mobile2: e.target.value.toUpperCase()})} /></div>
                  <div><label className="block text-sm font-semibold text-gray-700 mb-1">Mobile No. 3</label><input type="tel" placeholder="Alternative Number" className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded outline-none focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71] text-sm" value={onboardingForm.mobile3} onChange={(e) => setOnboardingForm({...onboardingForm, mobile3: e.target.value.toUpperCase()})} /></div>
                  {onboardingForm.customerType !== 'END CONSUMER' && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Add to WhatsApp Broadcast?</label>
                        <div className="flex gap-4 mt-2">
                          <label className="flex items-center gap-2 cursor-pointer text-sm"><input type="radio" name="whatsapp" value="Yes" checked={onboardingForm.whatsappGroup === 'Yes'} onChange={(e) => setOnboardingForm({...onboardingForm, whatsappGroup: e.target.value})} className="accent-[#2ecc71]" />Yes</label>
                          <label className="flex items-center gap-2 cursor-pointer text-sm"><input type="radio" name="whatsapp" value="No" checked={onboardingForm.whatsappGroup === 'No'} onChange={(e) => setOnboardingForm({...onboardingForm, whatsappGroup: e.target.value})} className="accent-[#2ecc71]" />No</label>
                        </div>
                      </div>
                      <div className="pt-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Personal Customer Group?</label>
                        <div className="flex gap-4 mt-2">
                          <label className="flex items-center gap-2 cursor-pointer text-sm"><input type="radio" name="personalGroup" value="Yes" checked={onboardingForm.personalGroup === 'Yes'} onChange={(e) => setOnboardingForm({...onboardingForm, personalGroup: e.target.value})} className="accent-[#2ecc71]" />Yes</label>
                          <label className="flex items-center gap-2 cursor-pointer text-sm"><input type="radio" name="personalGroup" value="No" checked={onboardingForm.personalGroup === 'No'} onChange={(e) => setOnboardingForm({...onboardingForm, personalGroup: e.target.value})} className="accent-[#2ecc71]" />No</label>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Section 3: Logistics & Internal */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b pb-2 mb-3">Logistics & Internal</h3>
                  <div><label className="block text-sm font-semibold text-gray-700 mb-1">Destination Address <span className="text-red-500">*</span></label><textarea required placeholder="Full shipping address" rows="2" className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded outline-none focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71] text-sm resize-none" value={onboardingForm.address} onChange={(e) => setOnboardingForm({...onboardingForm, address: e.target.value.toUpperCase()})}></textarea></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="block text-sm font-semibold text-gray-700 mb-1">City <span className="text-red-500">*</span></label><input type="text" required placeholder="City" className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded outline-none focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71] text-sm" value={onboardingForm.city} onChange={(e) => setOnboardingForm({...onboardingForm, city: e.target.value.toUpperCase()})} /></div>
                    <div><label className="block text-sm font-semibold text-gray-700 mb-1">State <span className="text-red-500">*</span></label><input type="text" required placeholder="State" className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded outline-none focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71] text-sm" value={onboardingForm.state} onChange={(e) => setOnboardingForm({...onboardingForm, state: e.target.value.toUpperCase()})} /></div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Preferred Transport</label>
                    <select className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded outline-none focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71] text-sm" value={onboardingForm.transport} onChange={(e) => setOnboardingForm({...onboardingForm, transport: e.target.value})}>
                      <option value="">-- Select Transport --</option>{masterSettings.transports.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="block text-sm font-semibold text-gray-700 mb-1">Rate List Type <span className="text-red-500">*</span></label><select required className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded outline-none focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71] text-sm" value={onboardingForm.rateList} onChange={(e) => setOnboardingForm({...onboardingForm, rateList: e.target.value})}><option value="">-- Select Rate Tier --</option>{availableRateLists.map(rl => <option key={rl} value={rl}>{rl}</option>)}</select></div>
                    <div><label className="block text-sm font-semibold text-gray-700 mb-1">Default Discount (%)</label><input type="number" min="0" step="0.1" placeholder="0" className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded outline-none focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71] text-sm" value={onboardingForm.discount} onChange={(e) => setOnboardingForm({...onboardingForm, discount: e.target.value})} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="block text-sm font-semibold text-gray-700 mb-1">Sales Person</label><select className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded outline-none focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71] text-sm" value={onboardingForm.salesPerson} onChange={(e) => setOnboardingForm({...onboardingForm, salesPerson: e.target.value})}><option value="">-- Sales Person --</option>{masterSettings.salesPersons.map(sp => <option key={sp} value={sp}>{sp}</option>)}</select></div>
                    <div><label className="block text-sm font-semibold text-gray-700 mb-1">CRM Name</label><select className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded outline-none focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71] text-sm" value={onboardingForm.crm} onChange={(e) => setOnboardingForm({...onboardingForm, crm: e.target.value})}><option value="">-- Select CRM --</option>{masterSettings.crms.map(crm => <option key={crm} value={crm}>{crm}</option>)}</select></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="block text-sm font-semibold text-gray-700 mb-1">Agent Name</label><select className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded outline-none focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71] text-sm" value={onboardingForm.agentName} onChange={(e) => setOnboardingForm({...onboardingForm, agentName: e.target.value})}><option value="">-- Select Agent --</option>{masterSettings.agents.map(a => <option key={a} value={a}>{a}</option>)}</select></div>
                    <div><label className="block text-sm font-semibold text-gray-700 mb-1">Payment Days</label><input type="number" min="0" placeholder="e.g. 30" className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded outline-none focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71] text-sm" value={onboardingForm.paymentDays} onChange={(e) => setOnboardingForm({...onboardingForm, paymentDays: e.target.value})} /></div>
                  </div>
                  <div><label className="block text-sm font-semibold text-gray-700 mb-1">Remarks</label><input type="text" placeholder="Internal notes" className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded outline-none focus:border-[#2ecc71] focus:ring-1 focus:ring-[#2ecc71] text-sm" value={onboardingForm.remarks} onChange={(e) => setOnboardingForm({...onboardingForm, remarks: e.target.value.toUpperCase()})} /></div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end gap-4">
                <button type="button" onClick={() => { resetOnboardingForm(); navigateTab('customers'); }} className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"><X className="w-5 h-5" /> Cancel</button>
                <button type="submit" className="bg-[#2ecc71] hover:bg-[#27ae60] text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-md flex items-center gap-2"><UserPlus className="w-5 h-5" /> {editingCustomerId ? 'Update Customer Profile' : 'Save & Register Customer'}</button>
              </div>
            </form>
          </div>
        )}

        {/* --- TAB: ORDER MASTER (HISTORY) --- */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
             <div className="bg-[#4c6fff] px-5 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-white rounded-t-lg">
               <div><h2 className="font-semibold text-lg tracking-wide">Saved Orders History</h2><p className="text-white/70 text-xs mt-0.5">Manage, edit, or reprint previously generated orders.</p></div>
             </div>
             <div className="overflow-x-auto p-4">
                {savedOrders.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200"><ClipboardList className="w-10 h-10 mx-auto mb-3 text-gray-300" />No orders have been saved yet. Generate one in the Order Form tab!</div>
                ) : (
                  <table className="w-full text-left text-sm border-collapse min-w-[700px]">
                    <thead><tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold uppercase text-gray-500 tracking-wider"><th className="p-4">Order No</th><th className="p-4">Date</th><th className="p-4">Customer Firm</th><th className="p-4 text-center">Items</th><th className="p-4 text-center">Dispatch Status</th><th className="p-4 text-right">Total Amount</th><th className="p-4 text-center">Actions</th></tr></thead>
                    <tbody>
                      {savedOrders.map(order => {
                        const dRecord = dispatchRecords.find(r => r.orderNo === order.orderNo);
                        return (
                        <tr key={order.orderNo} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="p-4 font-bold text-[#4c6fff] text-xs">{order.orderNo}</td>
                          <td className="p-4 text-gray-500 text-xs">{new Date(order.date).toLocaleDateString()}</td>
                          <td className="p-4 font-bold text-gray-800">{order.customer.name}</td>
                          <td className="p-4 text-center text-gray-600 font-medium"><span className="bg-gray-100 px-2 py-1 rounded-md">{order.lines.length} lines</span></td>
                          <td className="p-4 text-center">
                            {dRecord ? (
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold border border-green-200 uppercase inline-block">{dRecord.id} ({dRecord.bales} Bales)</span>
                            ) : (
                              <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-[10px] font-bold border border-yellow-200 uppercase inline-block">Pending</span>
                            )}
                          </td>
                          <td className="p-4 text-right font-black text-gray-900">₹{order.calculations.grandTotal.toFixed(2)}</td>
                          <td className="p-4 text-center flex justify-center gap-2">
                            <button onClick={() => handlePrint(order)} className="text-gray-500 hover:text-gray-800 p-2 rounded hover:bg-gray-100 transition-colors" title="Print Order"><Printer className="w-4 h-4" /></button>
                            <button onClick={() => handleEditOrder(order)} className="text-blue-500 hover:text-blue-700 p-2 rounded hover:bg-blue-50 transition-colors" title="Edit Order"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteOrder(order.orderNo)} className="text-red-400 hover:text-red-600 p-2 rounded hover:bg-red-50 transition-colors" title="Delete Order"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      )})}
                    </tbody>
                  </table>
                )}
             </div>
          </div>
        )}

        {/* --- TAB: CUSTOMER MASTER --- */}
        {activeTab === 'customers' && (
           <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col mb-4 min-h-[400px]">
             <div className="bg-[#4c6fff] px-5 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-white shrink-0 rounded-t-lg">
               <div><h2 className="font-semibold text-lg tracking-wide">CRM Master Data</h2></div>
               <div className="flex flex-wrap gap-2 shrink-0 mt-2 md:mt-0">
                 <button onClick={() => { resetOnboardingForm(); navigateTab('onboarding'); }} className="flex items-center gap-2 px-4 py-2 bg-[#2ecc71] hover:bg-[#27ae60] text-white rounded text-sm font-semibold transition-colors shadow-sm"><UserPlus className="w-4 h-4" /> Add New</button>
                 <button onClick={downloadCustomerTemplate} className="flex items-center gap-2 px-4 py-2 bg-white text-[#4c6fff] hover:bg-gray-100 rounded text-sm font-semibold transition-colors shadow-sm"><FileText className="w-4 h-4" /> Blank Template</button>
                 <button onClick={exportCustomersToCSV} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded text-sm font-semibold transition-colors text-white"><Download className="w-4 h-4" /> Export Data</button>
               </div>
             </div>

             <div className="p-4 bg-gray-50/50 border-b border-gray-200 flex flex-col gap-4 shrink-0">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                  <div className="relative w-full md:w-96 flex gap-2">
                    <div className="relative flex-1">
                      <input type="text" placeholder="Search by Name, Mobile, or ID/GST..." className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-[#4c6fff] focus:ring-1 focus:ring-[#4c6fff] transition-all text-sm shadow-sm" value={customerSearchTerm} onChange={(e) => setCustomerSearchTerm(e.target.value.toUpperCase())} />
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                    <button onClick={() => setShowFilters(!showFilters)} className={`px-3 py-2 border rounded-md text-sm font-bold flex items-center gap-2 transition-colors shadow-sm ${showFilters ? 'bg-[#4c6fff] text-white border-[#4c6fff]' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}><Filter className="w-4 h-4" /> Filters</button>
                  </div>
                  <div className="w-full md:w-auto text-xs text-gray-500 font-medium whitespace-nowrap bg-white px-3 py-2 border border-gray-200 rounded shadow-sm">Showing {filteredCustomerMaster.length} of {customers.length} Customers</div>
                </div>

                {showFilters && (
                  <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-inner grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-3 mt-2">
                    <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Agent Name</label><select className="w-full px-2 py-1.5 bg-gray-50 border border-gray-300 rounded outline-none focus:border-[#4c6fff] text-xs" value={customerFilters.agentName} onChange={e => setCustomerFilters({...customerFilters, agentName: e.target.value})}><option value="">All Agents</option>{masterSettings.agents.map(a => <option key={a} value={a}>{a}</option>)}</select></div>
                    <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">CRM Name</label><select className="w-full px-2 py-1.5 bg-gray-50 border border-gray-300 rounded outline-none focus:border-[#4c6fff] text-xs" value={customerFilters.crm} onChange={e => setCustomerFilters({...customerFilters, crm: e.target.value})}><option value="">All CRMs</option>{masterSettings.crms.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                    <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Customer Type</label><select className="w-full px-2 py-1.5 bg-gray-50 border border-gray-300 rounded outline-none focus:border-[#4c6fff] text-xs" value={customerFilters.customerType} onChange={e => setCustomerFilters({...customerFilters, customerType: e.target.value})}><option value="">All Types</option>{masterSettings.customerTypes.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                    <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Rate List</label><select className="w-full px-2 py-1.5 bg-gray-50 border border-gray-300 rounded outline-none focus:border-[#4c6fff] text-xs" value={customerFilters.rateList} onChange={e => setCustomerFilters({...customerFilters, rateList: e.target.value})}><option value="">All Rate Lists</option>{availableRateLists.map(r => <option key={r} value={r}>{r}</option>)}</select></div>
                    <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Status</label><select className="w-full px-2 py-1.5 bg-gray-50 border border-gray-300 rounded outline-none focus:border-[#4c6fff] text-xs" value={customerFilters.status} onChange={e => setCustomerFilters({...customerFilters, status: e.target.value})}><option value="">All Statuses</option><option value="Working">Working</option><option value="Not Working">Not Working</option></select></div>
                    <div><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">State</label><input type="text" placeholder="State..." className="w-full px-2 py-1.5 bg-gray-50 border border-gray-300 rounded outline-none focus:border-[#4c6fff] text-xs" value={customerFilters.state} onChange={e => setCustomerFilters({...customerFilters, state: e.target.value.toUpperCase()})} /></div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1"><label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">City</label><input type="text" placeholder="City..." className="w-full px-2 py-1.5 bg-gray-50 border border-gray-300 rounded outline-none focus:border-[#4c6fff] text-xs" value={customerFilters.city} onChange={e => setCustomerFilters({...customerFilters, city: e.target.value.toUpperCase()})} /></div>
                      <button onClick={() => setCustomerFilters({ agentName: '', rateList: '', customerType: '', status: '', state: '', city: '', crm: '' })} className="bg-red-50 text-red-500 border border-red-200 p-1.5 rounded hover:bg-red-100 transition-colors" title="Clear all filters"><FilterX className="w-4 h-4" /></button>
                    </div>
                  </div>
                )}
             </div>

             <div className="p-4 bg-gray-50/50 border-b border-gray-200 hidden md:block shrink-0">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center bg-white hover:border-[#4c6fff] hover:bg-[#f0f4ff] transition-all cursor-pointer relative">
                  <input type="file" accept=".csv" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleCustomerUpload} />
                  <Database className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                  <div className="text-gray-800 font-bold text-sm">Drop CSV here to bulk upload</div>
                </div>
             </div>

             <div className="overflow-auto flex-1 w-full bg-white relative rounded-b-lg">
                <table className="w-full text-left text-sm min-w-[1000px] whitespace-nowrap">
                  <thead className="sticky top-0 bg-gray-50 z-10 shadow-sm border-b border-gray-200">
                    <tr className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">
                      <th className="p-4 pl-6">ID / Agent</th>
                      <th className="p-4">Firm Name</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Mobile</th>
                      <th className="p-4">KYC ID</th>
                      <th className="p-4">Rate List</th>
                      <th className="p-4">Discount</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="align-top">
                    {filteredCustomerMaster.map((c, i) => (
                      <tr key={i} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                        <td className="p-4 pl-6 text-gray-500 font-mono text-xs">{c.id}{c.agentName && <span className="block text-[10px] text-gray-400 uppercase mt-0.5">{c.agentName}</span>}</td>
                        <td className="p-4 font-bold text-gray-800">{c.name}{c.customerType && <span className="block text-[10px] text-indigo-500 uppercase mt-0.5">{c.customerType}</span>}</td>
                        <td className="p-4">{c.status === 'Not Working' ? <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-[10px] font-bold border border-red-200 uppercase tracking-wider" title={c.statusRemark}>NOT WORKING</span> : <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold border border-green-200 uppercase tracking-wider">WORKING</span>}</td>
                        <td className="p-4 text-gray-600">{c.phone}</td>
                        <td className="p-4 text-gray-600 font-mono text-xs">{c.kycNumber ? `${c.kycType}: ${c.kycNumber}` : (c.gstNo ? `GST: ${c.gstNo}` : '-')}</td>
                        <td className="p-4"><span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold border border-gray-200">{c.rateList}</span></td>
                        <td className="p-4 text-green-600 font-bold">{c.discount}%</td>
                        <td className="p-4 text-center"><button onClick={() => handleEditCustomerMaster(c)} className="bg-white border border-gray-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 px-3 py-1.5 rounded text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 mx-auto"><Edit className="w-3.5 h-3.5" /> Edit Profile</button></td>
                      </tr>
                    ))}
                    {filteredCustomerMaster.length === 0 && <tr><td colSpan="8" className="p-8 text-center text-gray-400 bg-gray-50/50"><Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />No customers found matching "{customerSearchTerm}"</td></tr>}
                  </tbody>
                </table>
             </div>
           </div>
        )}

        {/* --- TAB: RATES MASTER --- */}
        {activeTab === 'rates' && (
           <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
             <div className="bg-[#e67e22] px-5 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-white">
               <div><h2 className="font-semibold text-lg tracking-wide">Rate List Catalog</h2></div>
               <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                 <button onClick={downloadRateListTemplate} className="flex items-center gap-2 px-4 py-2 bg-white text-[#e67e22] hover:bg-gray-100 rounded text-sm font-semibold transition-colors shadow-sm"><FileText className="w-4 h-4" /> Blank Template</button>
                 <button onClick={exportRateListToCSV} className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded text-sm font-semibold transition-colors text-white"><Download className="w-4 h-4" /> Export Rates</button>
               </div>
             </div>
             <div className="p-6 bg-gray-50/50 border-b border-gray-200">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-white hover:border-[#e67e22] hover:bg-[#fff3e0] transition-all cursor-pointer relative">
                  <input type="file" accept=".csv" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleRateListUpload} />
                  <Package className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <div className="text-gray-800 font-bold text-base mb-1">Drop Rate List CSV here</div>
                  <p className="text-xs text-gray-500">Headers required: id, category, size, design, and multiple rate lists columns</p>
                </div>
             </div>
             <div className="overflow-x-auto p-4">
                <table className="w-full text-left text-sm border border-gray-200 rounded-lg overflow-hidden shadow-sm min-w-[800px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">
                      <th className="p-4">Item ID</th><th className="p-4">Category</th><th className="p-4">Size</th><th className="p-4">Design Name</th>
                      {availableRateLists.map(listName => <th key={listName} className="p-4 bg-gray-100 text-gray-600 border-l border-white text-center">{listName}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, i) => (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-4 text-gray-500 font-mono text-xs">{item.id}</td><td className="p-4 font-semibold text-gray-700">{item.category}</td><td className="p-4 text-gray-600">{item.size}</td><td className="p-4 font-bold text-gray-800">{item.design}</td>
                        {availableRateLists.map(listName => <td key={listName} className="p-4 text-center font-medium text-gray-600 border-l border-gray-100">₹{item.rates[listName] || '0'}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
           </div>
        )}

        {/* --- TAB: STAFF MANAGEMENT --- */}
        {activeTab === 'users' && (currentUser?.roles?.includes('admin') || currentUser?.roles?.includes('mdo')) && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-[#8e44ad] px-5 py-4 flex items-center gap-3 text-white">
                  <UserPlus className="w-5 h-5" />
                  <h2 className="font-semibold text-lg tracking-wide">Create Staff Account</h2>
                </div>
                <form onSubmit={handleAddUser} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Employee Name <span className="text-red-500">*</span></label>
                    <input type="text" required value={newUserName} onChange={e=>setNewUserName(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:ring-1 focus:ring-purple-400 outline-none text-sm"/>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Login ID <span className="text-red-500">*</span></label>
                    <input type="text" required value={newUserId} onChange={e=>setNewUserId(e.target.value.toUpperCase())} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:ring-1 focus:ring-purple-400 outline-none text-sm font-mono"/>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Password <span className="text-red-500">*</span></label>
                    <input type="text" required value={newUserPassword} onChange={e=>setNewUserPassword(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:ring-1 focus:ring-purple-400 outline-none text-sm"/>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Department Access <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded bg-gray-50">
                      {masterSettings.roles.map(role => (
                        <label key={role.id} className="flex items-start gap-2 cursor-pointer text-xs">
                          <input type="checkbox" checked={newUserRoles.includes(role.id)} onChange={() => toggleNewUserRole(role.id)} className="mt-0.5 accent-purple-600" />
                          <span className="font-medium text-gray-700">{role.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-[#8e44ad] hover:bg-[#732d91] text-white font-bold py-3 rounded-lg shadow-sm transition-colors mt-2">Create Account</button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-[#2c3e50] px-5 py-4 flex items-center justify-between text-white">
                  <h2 className="font-semibold text-lg tracking-wide flex items-center gap-2"><Shield className="w-5 h-5"/> Active Staff Accounts</h2>
                  <span className="bg-white/20 px-3 py-1 rounded text-xs font-bold">{users.length} Users</span>
                </div>
                <div className="overflow-x-auto p-4">
                  <table className="w-full text-left text-sm border-collapse min-w-[500px]">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold uppercase text-gray-500 tracking-wider">
                        <th className="p-3">Employee Name</th>
                        <th className="p-3">Login ID</th>
                        <th className="p-3">Password</th>
                        <th className="p-3">Assigned Departments</th>
                        <th className="p-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-3 font-bold text-gray-800">{u.name}</td>
                          <td className="p-3 font-mono text-purple-600 font-bold">{u.id}</td>
                          <td className="p-3 text-gray-500 text-xs">{u.password}</td>
                          <td className="p-3">
                            <div className="flex flex-wrap gap-1">
                              {u.roles.map(r => (
                                <span key={r} className="bg-gray-100 border border-gray-200 text-gray-600 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                                  {masterSettings.roles.find(mr=>mr.id===r)?.label || r}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            <button onClick={() => handleRemoveUser(u.id)} disabled={u.id === 'ADMIN'} className={`p-1.5 rounded transition-colors ${u.id === 'ADMIN' ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}>
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB: SYSTEM MASTER SETTINGS --- */}
        {activeTab === 'settings' && (currentUser?.roles?.includes('admin') || currentUser?.roles?.includes('mdo')) && (
          <div className="space-y-6">
            
            {/* SYSTEM BACKUP AND RESTORE */}
            <div className="bg-white rounded-lg shadow-sm border border-red-200 overflow-hidden">
              <div className="bg-[#e74c3c] px-5 py-4 flex items-center gap-3 text-white rounded-t-lg">
                <Database className="w-5 h-5" />
                <h2 className="font-semibold text-lg tracking-wide">System Data Backup & Restore</h2>
              </div>
              <div className="p-6 bg-red-50/30 flex flex-col md:flex-row gap-6 items-center justify-between">
                <div className="max-w-2xl">
                  <h3 className="font-bold text-gray-800 text-base mb-1">Protect Your Data</h3>
                  <p className="text-sm text-gray-600">Download a complete snapshot of all ERP data (Orders, Customers, Workflows, Users). Store this file safely. You can use it to instantly restore the entire system in case of data loss.</p>
                </div>
                <div className="flex gap-4 shrink-0">
                  <button onClick={handleExportBackup} className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-800 rounded-lg text-sm font-bold transition-colors shadow-sm hover:bg-gray-50 hover:text-[#e74c3c]">
                    <Download className="w-4 h-4" /> Download Full Backup
                  </button>
                  <label className="flex items-center gap-2 px-6 py-3 bg-[#e74c3c] hover:bg-[#c0392b] text-white rounded-lg text-sm font-bold transition-colors shadow-md cursor-pointer">
                    <FileUp className="w-4 h-4" /> Restore from Backup
                    <input type="file" accept=".json" className="hidden" onChange={handleRestoreBackup} />
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-[#f39c12] px-5 py-4 flex items-center gap-3 text-white rounded-t-lg">
                <Settings className="w-5 h-5" />
                <h2 className="font-semibold text-lg tracking-wide">Configure Master Dropdown Menus</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2"><User className="w-4 h-4"/> Sales Persons</h3>
                  <div className="flex gap-2 mb-4">
                    <input type="text" className="w-full px-3 py-2 bg-white border border-gray-300 rounded outline-none focus:border-[#f39c12] text-sm" placeholder="Add Sales Person..." value={settingInputs.salesPersons} onChange={e => setSettingInputs({...settingInputs, salesPersons: e.target.value.toUpperCase()})} onKeyDown={e => e.key === 'Enter' && handleAddSetting('salesPersons')} />
                    <button onClick={() => handleAddSetting('salesPersons')} className="bg-[#f39c12] text-white px-3 rounded hover:bg-[#e67e22] transition-colors"><Plus className="w-4 h-4"/></button>
                  </div>
                  <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {masterSettings.salesPersons.map(sp => (
                      <li key={sp} className="flex justify-between items-center bg-white border border-gray-100 px-3 py-2 rounded text-sm text-gray-700 shadow-sm">{sp}<button onClick={() => handleRemoveSetting('salesPersons', sp)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4"/></button></li>
                    ))}
                  </ul>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2"><UserCircle className="w-4 h-4"/> CRM Names</h3>
                  <div className="flex gap-2 mb-4">
                    <input type="text" className="w-full px-3 py-2 bg-white border border-gray-300 rounded outline-none focus:border-[#f39c12] text-sm" placeholder="Add CRM..." value={settingInputs.crms} onChange={e => setSettingInputs({...settingInputs, crms: e.target.value.toUpperCase()})} onKeyDown={e => e.key === 'Enter' && handleAddSetting('crms')} />
                    <button onClick={() => handleAddSetting('crms')} className="bg-[#f39c12] text-white px-3 rounded hover:bg-[#e67e22] transition-colors"><Plus className="w-4 h-4"/></button>
                  </div>
                  <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {masterSettings.crms.map(crm => (
                      <li key={crm} className="flex justify-between items-center bg-white border border-gray-100 px-3 py-2 rounded text-sm text-gray-700 shadow-sm">{crm}<button onClick={() => handleRemoveSetting('crms', crm)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4"/></button></li>
                    ))}
                  </ul>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2"><Tag className="w-4 h-4"/> Agent Names</h3>
                  <div className="flex gap-2 mb-4">
                    <input type="text" className="w-full px-3 py-2 bg-white border border-gray-300 rounded outline-none focus:border-[#f39c12] text-sm" placeholder="Add agent..." value={settingInputs.agents} onChange={e => setSettingInputs({...settingInputs, agents: e.target.value.toUpperCase()})} onKeyDown={e => e.key === 'Enter' && handleAddSetting('agents')} />
                    <button onClick={() => handleAddSetting('agents')} className="bg-[#f39c12] text-white px-3 rounded hover:bg-[#e67e22] transition-colors"><Plus className="w-4 h-4"/></button>
                  </div>
                  <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {masterSettings.agents.map(a => (
                      <li key={a} className="flex justify-between items-center bg-white border border-gray-100 px-3 py-2 rounded text-sm text-gray-700 shadow-sm">{a}<button onClick={() => handleRemoveSetting('agents', a)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4"/></button></li>
                    ))}
                  </ul>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2"><Tag className="w-4 h-4"/> Customer Types</h3>
                  <div className="flex gap-2 mb-4">
                    <input type="text" className="w-full px-3 py-2 bg-white border border-gray-300 rounded outline-none focus:border-[#f39c12] text-sm" placeholder="Add type..." value={settingInputs.customerTypes} onChange={e => setSettingInputs({...settingInputs, customerTypes: e.target.value.toUpperCase()})} onKeyDown={e => e.key === 'Enter' && handleAddSetting('customerTypes')} />
                    <button onClick={() => handleAddSetting('customerTypes')} className="bg-[#f39c12] text-white px-3 rounded hover:bg-[#e67e22] transition-colors"><Plus className="w-4 h-4"/></button>
                  </div>
                  <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {masterSettings.customerTypes.map(type => (
                      <li key={type} className="flex justify-between items-center bg-white border border-gray-100 px-3 py-2 rounded text-sm text-gray-700 shadow-sm">{type}<button onClick={() => handleRemoveSetting('customerTypes', type)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4"/></button></li>
                    ))}
                  </ul>
                </div>
                {/* Customization Types Config */}
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2"><Settings className="w-4 h-4"/> Customization Types</h3>
                  <div className="flex gap-2 mb-4">
                    <input type="text" className="w-full px-3 py-2 bg-white border border-gray-300 rounded outline-none focus:border-[#f39c12] text-sm" placeholder="Add type..." value={settingInputs.customizationTypes} onChange={e => setSettingInputs({...settingInputs, customizationTypes: e.target.value.toUpperCase()})} onKeyDown={e => e.key === 'Enter' && handleAddSetting('customizationTypes')} />
                    <button onClick={() => handleAddSetting('customizationTypes')} className="bg-[#f39c12] text-white px-3 rounded hover:bg-[#e67e22] transition-colors"><Plus className="w-4 h-4"/></button>
                  </div>
                  <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {masterSettings.customizationTypes.map(type => (
                      <li key={type} className="flex justify-between items-center bg-white border border-gray-100 px-3 py-2 rounded text-sm text-gray-700 shadow-sm">{type}<button onClick={() => handleRemoveSetting('customizationTypes', type)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4"/></button></li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB: DISPATCH MASTER --- */}
        {activeTab === 'transport_master' && (currentUser?.roles?.includes('admin') || currentUser?.roles?.includes('dispatch')) && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Drivers Table */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-[#f39c12] px-5 py-4 flex items-center gap-3 text-white rounded-t-lg">
                  <Car className="w-5 h-5" />
                  <h2 className="font-semibold text-lg tracking-wide">Driver / Taxi Person Master</h2>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-100 border-b border-gray-200">
                        <tr className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">
                          <th className="p-3">Driver Name</th>
                          <th className="p-3">Contact Number</th>
                          <th className="p-3 text-center w-24">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200 bg-yellow-50/30">
                          <td className="p-2"><input type="text" placeholder="DRIVER NAME *" className="w-full px-2 py-1.5 border rounded text-xs uppercase focus:ring-1 focus:ring-[#f39c12] outline-none" value={newDriver.name} onChange={e => setNewDriver({...newDriver, name: e.target.value.toUpperCase()})}/></td>
                          <td className="p-2"><input type="text" placeholder="CONTACT *" className="w-full px-2 py-1.5 border rounded text-xs uppercase focus:ring-1 focus:ring-[#f39c12] outline-none" value={newDriver.contact} onChange={e => setNewDriver({...newDriver, contact: e.target.value.toUpperCase()})}/></td>
                          <td className="p-2 text-center"><button onClick={handleAddDriver} className="bg-[#f39c12] text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-[#e67e22] transition-colors whitespace-nowrap"><Plus className="w-3 h-3 inline"/> Add</button></td>
                        </tr>
                        {masterSettings.drivers.map(d => (
                          <tr key={d.id} className="border-b border-gray-100 hover:bg-white transition-colors">
                            <td className="p-3 font-bold text-gray-800">{d.name}</td>
                            <td className="p-3 text-gray-600">{d.contact}</td>
                            <td className="p-3 text-center"><button onClick={() => handleRemoveDriver(d.id)} className="text-gray-400 hover:text-red-500 p-1.5 rounded hover:bg-red-50"><Trash2 className="w-4 h-4"/></button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Packers Table (NEW) */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-[#d35400] px-5 py-4 flex items-center gap-3 text-white rounded-t-lg">
                  <Package className="w-5 h-5" />
                  <h2 className="font-semibold text-lg tracking-wide">Bale Packers Master</h2>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-100 border-b border-gray-200">
                        <tr className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">
                          <th className="p-3">Packer Name</th>
                          <th className="p-3 text-center w-24">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200 bg-orange-50/30">
                          <td className="p-2"><input type="text" placeholder="PACKER NAME *" className="w-full px-2 py-1.5 border rounded text-xs uppercase focus:ring-1 focus:ring-[#d35400] outline-none" value={newPackerName} onChange={e => setNewPackerName(e.target.value.toUpperCase())}/></td>
                          <td className="p-2 text-center"><button onClick={handleAddPacker} className="bg-[#d35400] text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-[#a04000] transition-colors whitespace-nowrap"><Plus className="w-3 h-3 inline"/> Add</button></td>
                        </tr>
                        {masterSettings.packers.map(p => (
                          <tr key={p.id} className="border-b border-gray-100 hover:bg-white transition-colors">
                            <td className="p-3 font-bold text-gray-800">{p.name}</td>
                            <td className="p-3 text-center"><button onClick={() => handleRemovePacker(p.id)} className="text-gray-400 hover:text-red-500 p-1.5 rounded hover:bg-red-50"><Trash2 className="w-4 h-4"/></button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-[#e67e22] px-5 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-white rounded-t-lg">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5" />
                  <h2 className="font-semibold text-lg tracking-wide">Logistics & Transport Master</h2>
                </div>
                <div className="flex gap-2">
                  <button onClick={downloadTransportTemplate} className="flex items-center gap-2 px-3 py-1.5 bg-white text-[#e67e22] hover:bg-gray-100 rounded text-xs font-semibold transition-colors shadow-sm"><FileText className="w-3.5 h-3.5" /> Template</button>
                  <button onClick={exportTransportsToCSV} className="flex items-center gap-2 px-3 py-1.5 bg-white/10 text-white border border-white/30 hover:bg-white/20 rounded text-xs font-semibold transition-colors shadow-sm"><Download className="w-3.5 h-3.5" /> Export</button>
                  <label className="flex items-center gap-2 px-3 py-1.5 bg-white/10 text-white border border-white/30 hover:bg-white/20 rounded text-xs font-semibold cursor-pointer shadow-sm"><Database className="w-3.5 h-3.5" /> Upload CSV<input type="file" accept=".csv" className="hidden" onChange={handleTransportUpload} /></label>
                </div>
              </div>

              <div className="p-6">
                <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
                  <table className="w-full text-left text-sm min-w-[900px]">
                    <thead className="bg-gray-100 border-b border-gray-200">
                      <tr className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">
                        <th className="p-3">Transport Name</th>
                        <th className="p-3">GST No.</th>
                        <th className="p-3">Contact</th>
                        <th className="p-3">Driver Name</th>
                        <th className="p-3">Pickup Slot</th>
                        <th className="p-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200 bg-yellow-50/30">
                        <td className="p-2"><input type="text" placeholder="NAME *" className="w-full px-2 py-1.5 border rounded text-xs uppercase focus:ring-1 focus:ring-[#f39c12] outline-none" value={newTransport.name} onChange={e => setNewTransport({...newTransport, name: e.target.value.toUpperCase()})}/></td>
                        <td className="p-2"><input type="text" placeholder="GST NO." className="w-full px-2 py-1.5 border rounded text-xs uppercase focus:ring-1 focus:ring-[#f39c12] outline-none" value={newTransport.gstNo} onChange={e => setNewTransport({...newTransport, gstNo: e.target.value.toUpperCase()})}/></td>
                        <td className="p-2"><input type="text" placeholder="PHONE" className="w-full px-2 py-1.5 border rounded text-xs uppercase focus:ring-1 focus:ring-[#f39c12] outline-none" value={newTransport.contact} onChange={e => setNewTransport({...newTransport, contact: e.target.value.toUpperCase()})}/></td>
                        <td className="p-2">
                          <select className="w-full px-2 py-1.5 border rounded text-xs focus:ring-1 focus:ring-[#f39c12] outline-none" value={newTransport.driverName} onChange={e => setNewTransport({...newTransport, driverName: e.target.value})}>
                            <option value="">-- SELECT DRIVER --</option>
                            {masterSettings.drivers.map(d => <option key={d.id} value={d.name}>{d.name} ({d.contact})</option>)}
                          </select>
                        </td>
                        <td className="p-2">
                          <select className="w-full px-2 py-1.5 border rounded text-xs focus:ring-1 focus:ring-[#f39c12] outline-none" value={newTransport.pickupSlot} onChange={e => setNewTransport({...newTransport, pickupSlot: e.target.value})}>
                            <option value="">-- SLOT --</option>
                            <option value="MORNING">MORNING</option>
                            <option value="EVENING">EVENING</option>
                            <option value="BOTH">BOTH</option>
                          </select>
                        </td>
                        <td className="p-2 text-center"><button onClick={handleAddTransport} className="bg-[#f39c12] text-white px-3 py-1.5 rounded text-xs font-bold hover:bg-[#e67e22] transition-colors whitespace-nowrap"><Plus className="w-3 h-3 inline"/> Add</button></td>
                      </tr>
                      {masterSettings.transports.map(t => (
                        <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-3 font-bold text-gray-800">{t.name}</td>
                          <td className="p-3 text-gray-600 font-mono text-xs">{t.gstNo || '-'}</td>
                          <td className="p-3 text-gray-600">{t.contact || '-'}</td>
                          <td className="p-3 text-gray-600">{t.driverName || '-'}</td>
                          <td className="p-3 text-gray-600 font-bold">{t.pickupSlot || '-'}</td>
                          <td className="p-3 text-center"><button onClick={() => handleRemoveTransport(t.id)} className="text-gray-400 hover:text-red-500 p-1.5 rounded hover:bg-red-50"><Trash2 className="w-4 h-4"/></button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB: DAILY DISPATCH & BALE TRACKING --- */}
        {activeTab === 'dispatch_ops' && (currentUser?.roles?.includes('admin') || currentUser?.roles?.includes('dispatch')) && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                   <div className="bg-[#2ecc71] px-5 py-4 flex items-center gap-3 text-white">
                      <Package className="w-5 h-5" />
                      <h2 className="font-semibold text-lg tracking-wide">Record Dispatch</h2>
                   </div>
                   <form onSubmit={handleSaveDispatchRecord} className="p-6 space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Select Pending Order <span className="text-red-500">*</span></label>
                        <select required value={dispatchForm.orderNo} onChange={e=>setDispatchForm({...dispatchForm, orderNo: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:ring-1 focus:ring-green-400 outline-none text-sm font-semibold">
                          <option value="">-- Choose Order --</option>
                          {savedOrders.filter(o => !dispatchRecords.some(r => r.orderNo === o.orderNo)).map(o => (
                            <option key={o.orderNo} value={o.orderNo}>{o.orderNo} - {o.customer.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Number of Bales Packed <span className="text-red-500">*</span></label>
                        <input type="number" min="1" required value={dispatchForm.bales} onChange={e=>setDispatchForm({...dispatchForm, bales: parseInt(e.target.value)||0})} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:ring-1 focus:ring-green-400 outline-none text-sm font-mono text-center text-lg"/>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Packed By <span className="text-red-500">*</span></label>
                          <select required value={dispatchForm.packerId} onChange={e=>setDispatchForm({...dispatchForm, packerId: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:ring-1 focus:ring-green-400 outline-none text-sm font-semibold text-orange-700">
                            <option value="">- Packer -</option>
                            {masterSettings.packers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Taken By Driver <span className="text-red-500">*</span></label>
                          <select required value={dispatchForm.driverId} onChange={e=>setDispatchForm({...dispatchForm, driverId: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded focus:ring-1 focus:ring-green-400 outline-none text-sm font-semibold text-blue-700">
                            <option value="">- Driver -</option>
                            {masterSettings.drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                          </select>
                        </div>
                      </div>
                      <button type="submit" className="w-full bg-[#2ecc71] hover:bg-[#27ae60] text-white font-bold py-3 rounded-lg shadow-sm transition-colors mt-2">Generate Dispatch No & Save</button>
                   </form>
                </div>

                {/* Monthly Driver Payout Summary */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                   <div className="bg-[#34495e] px-5 py-4 flex items-center gap-3 text-white">
                      <Calculator className="w-5 h-5" />
                      <h2 className="font-semibold text-sm tracking-wide">Monthly Driver Payout Calc</h2>
                   </div>
                   <div className="p-4">
                     <p className="text-xs text-gray-500 mb-3">Total bales taken by drivers in the current month.</p>
                     <div className="space-y-2">
                       {masterSettings.drivers.map(driver => {
                         const currentMonthBales = dispatchRecords.filter(r => r.driverId === driver.id && new Date(r.date).getMonth() === new Date().getMonth()).reduce((sum, r) => sum + r.bales, 0);
                         return (
                           <div key={driver.id} className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-200">
                             <span className="font-bold text-gray-700 text-sm">{driver.name}</span>
                             <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full text-sm">{currentMonthBales} Bales</span>
                           </div>
                         );
                       })}
                     </div>
                   </div>
                </div>
             </div>

             <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
                  <div className="bg-[#2c3e50] px-5 py-4 flex items-center justify-between text-white shrink-0">
                    <h2 className="font-semibold text-lg tracking-wide">Today's Dispatch Log</h2>
                    <span className="bg-white/20 px-3 py-1 rounded text-xs font-bold">
                       {dispatchRecords.filter(r => new Date(r.date).toDateString() === new Date().toDateString()).reduce((sum, r) => sum + r.bales, 0)} Bales Packed Today
                    </span>
                  </div>
                  <div className="overflow-x-auto p-4 flex-1">
                    <table className="w-full text-left text-sm border-collapse min-w-[700px]">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-[10px] font-bold uppercase text-gray-500 tracking-wider">
                          <th className="p-3">Dispatch No</th>
                          <th className="p-3">Order Ref</th>
                          <th className="p-3 text-center">Bales</th>
                          <th className="p-3">Packed By</th>
                          <th className="p-3">Driver Taken</th>
                          <th className="p-3">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dispatchRecords.filter(r => new Date(r.date).toDateString() === new Date().toDateString()).map(record => (
                          <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="p-3 font-bold text-green-600">{record.id}</td>
                            <td className="p-3 font-mono text-xs text-gray-600">{record.orderNo}</td>
                            <td className="p-3 text-center font-black text-lg text-gray-800">{record.bales}</td>
                            <td className="p-3 font-semibold text-orange-600 text-xs">{masterSettings.packers.find(p=>p.id===record.packerId)?.name || 'N/A'}</td>
                            <td className="p-3 font-semibold text-blue-600 text-xs">{masterSettings.drivers.find(d=>d.id===record.driverId)?.name || 'N/A'}</td>
                            <td className="p-3 text-gray-500 text-xs">{new Date(record.date).toLocaleTimeString('en-IN', { timeStyle: 'short' })}</td>
                          </tr>
                        ))}
                        {dispatchRecords.filter(r => new Date(r.date).toDateString() === new Date().toDateString()).length === 0 && (
                           <tr><td colSpan="6" className="text-center p-6 text-gray-400">No dispatches recorded today yet.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
             </div>
          </div>
        )}

      </main>
    </div>
  );
}