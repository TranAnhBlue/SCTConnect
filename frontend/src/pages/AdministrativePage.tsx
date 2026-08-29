import React, { useState, useEffect } from 'react';
import { organizationService } from '../services/organizationService';
import { villageService } from '../services/villageService';
import { categoryService } from '../services/categoryService';
import apiClient from '../services/api';
import { useAuth } from '../context/AuthContext';
import { IOrganization, IVillage, ICategory } from '../types/api';
import {
  GitFork,
  Building2,
  MapPin,
  Tag,
  Search,
  ChevronRight,
  ChevronDown,
  Layers,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Pencil,
  Save,
  X,
  ShieldCheck
} from 'lucide-react';

// =================================================================
// 1. RECURSIVE ORG TREE NODE
// =================================================================
const OrgTreeNode: React.FC<{
  node: IOrganization;
  depth?: number;
  onEdit?: (org: IOrganization) => void;
  onToggleStatus?: (org: IOrganization) => void;
  isAdmin?: boolean;
}> = ({ node, depth = 0, onEdit, onToggleStatus, isAdmin }) => {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div style={{ marginLeft: depth * 18 }}>
      <div
        className="org-tree-node"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 14px',
          borderRadius: 8,
          background: depth === 0 ? 'var(--blue-soft)' : 'var(--paper)',
          marginBottom: 6,
          border: '1px solid var(--line)'
        }}
      >
        <div
          style={{ cursor: hasChildren ? 'pointer' : 'default', display: 'flex', alignItems: 'center' }}
          onClick={() => hasChildren && setExpanded(p => !p)}
        >
          {hasChildren ? (
            expanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />
          ) : (
            <div style={{ width: 15 }} />
          )}
        </div>
        <Building2 size={16} style={{ color: 'var(--blue)' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{node.name}</div>
          <div style={{ fontSize: '0.76rem', color: 'var(--ink-soft)' }}>
            Mã: {node.code} · Loại:{' '}
            {node.type === 'fatherland_front'
              ? 'Mặt trận Tổ quốc'
              : node.type === 'union'
              ? 'Đoàn thể'
              : 'Khác'}
          </div>
        </div>
        <span
          className={`badge ${node.isActive ? 'badge-success' : 'badge-neutral'}`}
          style={{ fontSize: '0.72rem' }}
        >
          {node.isActive ? 'Hoạt động' : 'Tạm dừng'}
        </span>

        {isAdmin && (
          <div style={{ display: 'inline-flex', gap: 6, marginLeft: 8 }}>
            <button
              type="button"
              onClick={() => onEdit?.(node)}
              style={{
                background: '#fff',
                border: '1px solid var(--line)',
                borderRadius: 6,
                padding: '4px 8px',
                cursor: 'pointer',
                fontSize: '0.78rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}
              title="Chỉnh sửa tổ chức"
            >
              <Pencil size={12} /> Sửa
            </button>
            <button
              type="button"
              onClick={() => onToggleStatus?.(node)}
              style={{
                background: '#fff',
                border: `1px solid ${node.isActive ? '#feb2b2' : 'var(--line)'}`,
                color: node.isActive ? '#c53030' : 'var(--success)',
                borderRadius: 6,
                padding: '4px 8px',
                cursor: 'pointer',
                fontSize: '0.78rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              {node.isActive ? <><X size={12} /> Tạm dừng</> : <><CheckCircle2 size={12} /> Kích hoạt</>}
            </button>
          </div>
        )}
      </div>

      {expanded &&
        hasChildren &&
        node.children!.map(child => (
          <OrgTreeNode
            key={child.id}
            node={child}
            depth={depth + 1}
            onEdit={onEdit}
            onToggleStatus={onToggleStatus}
            isAdmin={isAdmin}
          />
        ))}
    </div>
  );
};

// =================================================================
// 2. MAIN COMPONENT: ADMINISTRATIVE MANAGEMENT PAGE
// =================================================================
export const AdministrativePage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user.userType === 'admin';

  // 3 Tabs: 'organizations' | 'villages' | 'categories'
  const [activeTab, setActiveTab] = useState<'organizations' | 'villages' | 'categories'>('organizations');
  const [orgSubView, setOrgSubView] = useState<'tree' | 'flat'>('tree');

  // Dữ liệu
  const [organizations, setOrganizations] = useState<IOrganization[]>([]);
  const [orgTree, setOrgTree] = useState<IOrganization[]>([]);
  const [villages, setVillages] = useState<IVillage[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [orgModal, setOrgModal] = useState<{ open: boolean; item?: IOrganization | null }>({ open: false });
  const [villageModal, setVillageModal] = useState<{ open: boolean; item?: IVillage | null }>({ open: false });
  const [categoryModal, setCategoryModal] = useState<{ open: boolean; item?: ICategory | null }>({ open: false });

  // Form states
  const [orgForm, setOrgForm] = useState({ code: '', name: '', type: 'union' as 'fatherland_front' | 'union' | 'other' });
  const [villageForm, setVillageForm] = useState({ code: '', name: '' });
  const [categoryForm, setCategoryForm] = useState({ code: '', name: '', description: '' });

  const [saving, setSaving] = useState(false);
  const [modalErr, setModalErr] = useState('');

  // Tải dữ liệu tổng thể
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [treeData, flatOrgs, vData, cData] = await Promise.all([
        organizationService.getTree(),
        organizationService.getList(),
        villageService.getVillages(),
        categoryService.getCategories()
      ]);
      setOrgTree(treeData);
      setOrganizations(flatOrgs);
      setVillages(vData);
      setCategories(cData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // --- Handlers: Tổ chức ---
  const handleOpenOrgModal = (item?: IOrganization) => {
    if (item) {
      setOrgModal({ open: true, item });
      setOrgForm({ code: item.code, name: item.name, type: item.type || 'union' });
    } else {
      setOrgModal({ open: true, item: null });
      setOrgForm({ code: '', name: '', type: 'union' });
    }
    setModalErr('');
  };

  const handleSaveOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgForm.code.trim() || !orgForm.name.trim()) {
      setModalErr('Vui lòng nhập đầy đủ mã và tên tổ chức');
      return;
    }
    setSaving(true);
    setModalErr('');
    try {
      if (orgModal.item) {
        await organizationService.update(orgModal.item.id, {
          name: orgForm.name.trim(),
          type: orgForm.type
        });
      } else {
        await organizationService.create({
          code: orgForm.code.trim(),
          name: orgForm.name.trim(),
          type: orgForm.type
        });
      }
      setOrgModal({ open: false });
      await loadAllData();
    } catch (err: any) {
      setModalErr(err?.response?.data?.message || 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleOrgStatus = async (org: IOrganization) => {
    try {
      await organizationService.update(org.id, { isActive: !org.isActive });
      await loadAllData();
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Cập nhật trạng thái thất bại');
    }
  };

  // --- Handlers: Thôn / TDP ---
  const handleOpenVillageModal = (item?: IVillage) => {
    if (item) {
      setVillageModal({ open: true, item });
      setVillageForm({ code: item.code, name: item.name });
    } else {
      setVillageModal({ open: true, item: null });
      setVillageForm({ code: '', name: '' });
    }
    setModalErr('');
  };

  const handleSaveVillage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!villageForm.code.trim() || !villageForm.name.trim()) {
      setModalErr('Vui lòng nhập đầy đủ mã và tên Thôn / TDP');
      return;
    }
    setSaving(true);
    setModalErr('');
    try {
      if (villageModal.item) {
        await apiClient.patch(`/villages/${villageModal.item.id}`, {
          code: villageForm.code.trim(),
          name: villageForm.name.trim()
        });
      } else {
        await apiClient.post('/villages', {
          code: villageForm.code.trim(),
          name: villageForm.name.trim()
        });
      }
      setVillageModal({ open: false });
      await loadAllData();
    } catch (err: any) {
      setModalErr(err?.response?.data?.message || 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleVillageStatus = async (v: IVillage) => {
    try {
      await apiClient.patch(`/villages/${v.id}`, { isActive: !v.isActive });
      setVillages(prev => prev.map(x => (x.id === v.id ? { ...x, isActive: !x.isActive } : x)));
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Cập nhật trạng thái thất bại');
    }
  };

  // --- Handlers: Lĩnh vực ---
  const handleOpenCategoryModal = (item?: ICategory) => {
    if (item) {
      setCategoryModal({ open: true, item });
      setCategoryForm({ code: item.code, name: item.name, description: item.description || '' });
    } else {
      setCategoryModal({ open: true, item: null });
      setCategoryForm({ code: '', name: '', description: '' });
    }
    setModalErr('');
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.code.trim() || !categoryForm.name.trim()) {
      setModalErr('Vui lòng nhập đầy đủ mã và tên lĩnh vực');
      return;
    }
    setSaving(true);
    setModalErr('');
    try {
      if (categoryModal.item) {
        await apiClient.patch(`/categories/${categoryModal.item.id}`, {
          code: categoryForm.code.trim(),
          name: categoryForm.name.trim(),
          description: categoryForm.description.trim() || undefined
        });
      } else {
        await apiClient.post('/categories', {
          code: categoryForm.code.trim(),
          name: categoryForm.name.trim(),
          description: categoryForm.description.trim() || undefined
        });
      }
      setCategoryModal({ open: false });
      await loadAllData();
    } catch (err: any) {
      setModalErr(err?.response?.data?.message || 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleCategoryStatus = async (c: ICategory) => {
    try {
      await apiClient.patch(`/categories/${c.id}`, { isActive: !c.isActive });
      setCategories(prev => prev.map(x => (x.id === c.id ? { ...x, isActive: !x.isActive } : x)));
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Cập nhật trạng thái thất bại');
    }
  };

  // Lọc dữ liệu theo Search
  const filteredOrgs = organizations.filter(
    o => !searchTerm || o.name.toLowerCase().includes(searchTerm.toLowerCase()) || o.code.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredVillages = villages.filter(
    v => !searchTerm || v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.code.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredCategories = categories.filter(
    c => !searchTerm || c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="administrative-page">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h2>Quản Trị Tổ Chức &amp; Địa Bàn</h2>
          <p className="page-sub">
            Quản lý tập trung toàn bộ Cơ cấu Hội đoàn, Thôn / Tổ dân phố và Lĩnh vực phản ánh toàn xã
          </p>
        </div>

        {isAdmin && (
          <div>
            {activeTab === 'organizations' && (
              <button type="button" className="cta-btn" onClick={() => handleOpenOrgModal()}>
                <PlusCircle size={16} />
                <span>Thêm tổ chức mới</span>
              </button>
            )}
            {activeTab === 'villages' && (
              <button type="button" className="cta-btn" onClick={() => handleOpenVillageModal()}>
                <PlusCircle size={16} />
                <span>Thêm Thôn / TDP mới</span>
              </button>
            )}
            {activeTab === 'categories' && (
              <button type="button" className="cta-btn" onClick={() => handleOpenCategoryModal()}>
                <PlusCircle size={16} />
                <span>Thêm lĩnh vực mới</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Primary Tab Navigation */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, borderBottom: '1px solid var(--line)', paddingBottom: 12 }}>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'organizations' ? 'active' : ''}`}
          onClick={() => { setActiveTab('organizations'); setSearchTerm(''); }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 18px', fontSize: '0.92rem' }}
        >
          <Building2 size={16} />
          <span>Tổ chức &amp; Đoàn thể ({organizations.length})</span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === 'villages' ? 'active' : ''}`}
          onClick={() => { setActiveTab('villages'); setSearchTerm(''); }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 18px', fontSize: '0.92rem' }}
        >
          <MapPin size={16} />
          <span>Thôn / Tổ dân phố ({villages.length})</span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => { setActiveTab('categories'); setSearchTerm(''); }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 18px', fontSize: '0.92rem' }}
        >
          <Tag size={16} />
          <span>Lĩnh vực phản ánh ({categories.length})</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="filter-card" style={{ marginBottom: 18 }}>
        <div className="filter-controls">
          <div className="search-bar" style={{ flex: 1 }}>
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder={
                activeTab === 'organizations'
                  ? 'Tìm tổ chức theo tên hoặc mã...'
                  : activeTab === 'villages'
                  ? 'Tìm Thôn / Tổ dân phố...'
                  : 'Tìm lĩnh vực phản ánh...'
              }
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button type="button" className="clear-btn" onClick={() => setSearchTerm('')}>
                ✕
              </button>
            )}
          </div>

          {activeTab === 'organizations' && (
            <div style={{ display: 'flex', gap: 4, background: 'var(--paper)', padding: 3, borderRadius: 8 }}>
              <button
                type="button"
                className={`tab-btn ${orgSubView === 'tree' ? 'active' : ''}`}
                onClick={() => setOrgSubView('tree')}
                style={{ padding: '5px 12px', fontSize: '0.82rem', borderRadius: 6 }}
              >
                <GitFork size={13} style={{ display: 'inline', marginRight: 4 }} /> Sơ đồ cây
              </button>
              <button
                type="button"
                className={`tab-btn ${orgSubView === 'flat' ? 'active' : ''}`}
                onClick={() => setOrgSubView('flat')}
                style={{ padding: '5px 12px', fontSize: '0.82rem', borderRadius: 6 }}
              >
                <Layers size={13} style={{ display: 'inline', marginRight: 4 }} /> Danh sách phẳng
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content Rendering */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: TỔ CHỨC & ĐOÀN THỂ */}
          {activeTab === 'organizations' && (
            <>
              {orgSubView === 'tree' ? (
                <div className="card" style={{ padding: '20px 24px' }}>
                  <h3 style={{ marginBottom: 16 }}>Sơ đồ cây hệ thống Mặt trận Tổ quốc và các đoàn thể</h3>
                  {orgTree.length === 0 ? (
                    <div className="empty-state">
                      <GitFork size={36} className="text-muted" />
                      <p>Chưa có dữ liệu cơ cấu tổ chức</p>
                    </div>
                  ) : (
                    orgTree.map(node => (
                      <OrgTreeNode
                        key={node.id}
                        node={node}
                        depth={0}
                        onEdit={handleOpenOrgModal}
                        onToggleStatus={handleToggleOrgStatus}
                        isAdmin={isAdmin}
                      />
                    ))
                  )}
                </div>
              ) : (
                <div className="card">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Tên tổ chức</th>
                        <th>Mã</th>
                        <th>Phân loại</th>
                        <th style={{ textAlign: 'center' }}>Trạng thái</th>
                        {isAdmin && <th style={{ textAlign: 'center' }}>Thao tác</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrgs.length === 0 ? (
                        <tr>
                          <td colSpan={isAdmin ? 6 : 5} style={{ textAlign: 'center', padding: 28, color: 'var(--ink-soft)' }}>
                            Không tìm thấy tổ chức nào
                          </td>
                        </tr>
                      ) : (
                        filteredOrgs.map((org, idx) => (
                          <tr key={org.id} style={{ opacity: org.isActive ? 1 : 0.6 }}>
                            <td style={{ color: 'var(--ink-soft)', fontSize: '0.8rem' }}>{idx + 1}</td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Building2 size={16} style={{ color: 'var(--blue)' }} />
                                <strong>{org.name}</strong>
                              </div>
                            </td>
                            <td><code style={{ fontSize: '0.8rem' }}>{org.code}</code></td>
                            <td>
                              {org.type === 'fatherland_front'
                                ? 'Mặt trận Tổ quốc'
                                : org.type === 'union'
                                ? 'Đoàn thể'
                                : 'Khác'}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <span className={`badge ${org.isActive ? 'badge-success' : 'badge-neutral'}`}>
                                {org.isActive ? <><CheckCircle2 size={11} /> Hoạt động</> : <><XCircle size={11} /> Tạm dừng</>}
                              </span>
                            </td>
                            {isAdmin && (
                              <td style={{ textAlign: 'center' }}>
                                <div style={{ display: 'inline-flex', gap: 6 }}>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenOrgModal(org)}
                                    style={{
                                      background: '#fff', border: '1px solid var(--line)', borderRadius: 6,
                                      padding: '4px 10px', cursor: 'pointer', fontSize: '0.82rem',
                                      display: 'inline-flex', alignItems: 'center', gap: 4
                                    }}
                                  >
                                    <Pencil size={12} /> Sửa
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleOrgStatus(org)}
                                    style={{
                                      background: '#fff',
                                      border: `1px solid ${org.isActive ? '#feb2b2' : 'var(--line)'}`,
                                      color: org.isActive ? '#c53030' : 'var(--success)',
                                      borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: '0.82rem',
                                      display: 'inline-flex', alignItems: 'center', gap: 4
                                    }}
                                  >
                                    {org.isActive ? <><X size={12} /> Tạm dừng</> : <><CheckCircle2 size={12} /> Kích hoạt</>}
                                  </button>
                                </div>
                              </td>
                            )}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* TAB 2: THÔN / TỔ DÂN PHỐ */}
          {activeTab === 'villages' && (
            <div className="card">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Mã định danh</th>
                    <th>Tên Thôn / Tổ dân phố</th>
                    <th style={{ textAlign: 'center' }}>Trạng thái</th>
                    {isAdmin && <th style={{ textAlign: 'center' }}>Thao tác</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredVillages.length === 0 ? (
                    <tr>
                      <td colSpan={isAdmin ? 5 : 4} style={{ textAlign: 'center', padding: 28, color: 'var(--ink-soft)' }}>
                        Không tìm thấy Thôn / Tổ dân phố nào
                      </td>
                    </tr>
                  ) : (
                    filteredVillages.map((v, idx) => (
                      <tr key={v.id} style={{ opacity: v.isActive ? 1 : 0.6 }}>
                        <td style={{ color: 'var(--ink-soft)', fontSize: '0.8rem' }}>{idx + 1}</td>
                        <td><code style={{ fontSize: '0.82rem' }}>{v.code}</code></td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <MapPin size={15} style={{ color: 'var(--blue)' }} />
                            <strong>{v.name}</strong>
                          </div>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={`badge ${v.isActive ? 'badge-success' : 'badge-neutral'}`}>
                            {v.isActive ? <><CheckCircle2 size={11} /> Hoạt động</> : <><XCircle size={11} /> Tạm dừng</>}
                          </span>
                        </td>
                        {isAdmin && (
                          <td style={{ textAlign: 'center' }}>
                            <div style={{ display: 'inline-flex', gap: 6 }}>
                              <button
                                type="button"
                                onClick={() => handleOpenVillageModal(v)}
                                style={{
                                  background: '#fff', border: '1px solid var(--line)', borderRadius: 6,
                                  padding: '4px 10px', cursor: 'pointer', fontSize: '0.82rem',
                                  display: 'inline-flex', alignItems: 'center', gap: 4
                                }}
                              >
                                <Pencil size={12} /> Sửa
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToggleVillageStatus(v)}
                                style={{
                                  background: '#fff',
                                  border: `1px solid ${v.isActive ? '#feb2b2' : 'var(--line)'}`,
                                  color: v.isActive ? '#c53030' : 'var(--success)',
                                  borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: '0.82rem',
                                  display: 'inline-flex', alignItems: 'center', gap: 4
                                }}
                              >
                                {v.isActive ? <><X size={12} /> Tạm dừng</> : <><CheckCircle2 size={12} /> Kích hoạt</>}
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 3: LĨNH VỰC PHẢN ÁNH */}
          {activeTab === 'categories' && (
            <div className="card">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Mã lĩnh vực</th>
                    <th>Tên lĩnh vực chuyên đề</th>
                    <th>Mô tả ghi chú</th>
                    <th style={{ textAlign: 'center' }}>Trạng thái</th>
                    {isAdmin && <th style={{ textAlign: 'center' }}>Thao tác</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.length === 0 ? (
                    <tr>
                      <td colSpan={isAdmin ? 6 : 5} style={{ textAlign: 'center', padding: 28, color: 'var(--ink-soft)' }}>
                        Không tìm thấy lĩnh vực phản ánh nào
                      </td>
                    </tr>
                  ) : (
                    filteredCategories.map((c, idx) => (
                      <tr key={c.id} style={{ opacity: c.isActive ? 1 : 0.6 }}>
                        <td style={{ color: 'var(--ink-soft)', fontSize: '0.8rem' }}>{idx + 1}</td>
                        <td><code style={{ fontSize: '0.82rem' }}>{c.code}</code></td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Tag size={15} style={{ color: 'var(--blue)' }} />
                            <strong>{c.name}</strong>
                          </div>
                        </td>
                        <td style={{ fontSize: '0.85rem', color: 'var(--ink-soft)', maxWidth: 220 }}>
                          {c.description || '—'}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <span className={`badge ${c.isActive ? 'badge-success' : 'badge-neutral'}`}>
                            {c.isActive ? <><CheckCircle2 size={11} /> Hoạt động</> : <><XCircle size={11} /> Tạm dừng</>}
                          </span>
                        </td>
                        {isAdmin && (
                          <td style={{ textAlign: 'center' }}>
                            <div style={{ display: 'inline-flex', gap: 6 }}>
                              <button
                                type="button"
                                onClick={() => handleOpenCategoryModal(c)}
                                style={{
                                  background: '#fff', border: '1px solid var(--line)', borderRadius: 6,
                                  padding: '4px 10px', cursor: 'pointer', fontSize: '0.82rem',
                                  display: 'inline-flex', alignItems: 'center', gap: 4
                                }}
                              >
                                <Pencil size={12} /> Sửa
                              </button>
                              <button
                                type="button"
                                onClick={() => handleToggleCategoryStatus(c)}
                                style={{
                                  background: '#fff',
                                  border: `1px solid ${c.isActive ? '#feb2b2' : 'var(--line)'}`,
                                  color: c.isActive ? '#c53030' : 'var(--success)',
                                  borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: '0.82rem',
                                  display: 'inline-flex', alignItems: 'center', gap: 4
                                }}
                              >
                                {c.isActive ? <><X size={12} /> Tạm dừng</> : <><CheckCircle2 size={12} /> Kích hoạt</>}
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ================================================================= */}
      {/* MODAL 1: TỔ CHỨC */}
      {/* ================================================================= */}
      {orgModal.open && isAdmin && (
        <div className="app-modal-overlay" onClick={() => setOrgModal({ open: false })}>
          <div className="app-modal-box" onClick={e => e.stopPropagation()}>
            <div className="app-modal-header">
              <h3>{orgModal.item ? 'Chỉnh Sửa Tổ Chức' : 'Tạo Tổ Chức Mới'}</h3>
              <button
                type="button"
                className="app-modal-close-btn"
                onClick={() => setOrgModal({ open: false })}
              >
                <X size={18} />
              </button>
            </div>

            {modalErr && (
              <div style={{ background: '#fff5f5', color: '#c53030', padding: '10px 16px', fontSize: '0.88rem', borderBottom: '1px solid #fed7d7' }}>
                {modalErr}
              </div>
            )}

            <form onSubmit={handleSaveOrg}>
              <div className="app-modal-body">
                <div className="form-group">
                  <label>Mã tổ chức <span className="req">*</span></label>
                  <input
                    type="text"
                    required
                    disabled={!!orgModal.item}
                    minLength={2}
                    maxLength={50}
                    placeholder="VD: DOAN_TN"
                    value={orgForm.code}
                    onChange={e => setOrgForm(p => ({ ...p, code: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>Tên tổ chức <span className="req">*</span></label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    maxLength={255}
                    placeholder="VD: Đoàn TNCS Hồ Chí Minh"
                    value={orgForm.name}
                    onChange={e => setOrgForm(p => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>Loại hình tổ chức</label>
                  <select
                    value={orgForm.type}
                    onChange={e => setOrgForm(p => ({ ...p, type: e.target.value as any }))}
                  >
                    <option value="fatherland_front">Mặt trận Tổ quốc</option>
                    <option value="union">Hội / Đoàn thể</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>

              <div className="app-modal-footer">
                <button type="button" className="cta-ghost" onClick={() => setOrgModal({ open: false })}>
                  Hủy
                </button>
                <button
                  type="submit"
                  className="cta-btn"
                  disabled={saving}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <Save size={15} />
                  <span>{saving ? 'Đang lưu...' : 'Lưu dữ liệu'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 2: THÔN / TỔ DÂN PHỐ */}
      {/* ================================================================= */}
      {villageModal.open && isAdmin && (
        <div className="app-modal-overlay" onClick={() => setVillageModal({ open: false })}>
          <div className="app-modal-box" onClick={e => e.stopPropagation()}>
            <div className="app-modal-header">
              <h3>{villageModal.item ? 'Sửa Thôn / Tổ dân phố' : 'Thêm Thôn / TDP Mới'}</h3>
              <button
                type="button"
                className="app-modal-close-btn"
                onClick={() => setVillageModal({ open: false })}
              >
                <X size={18} />
              </button>
            </div>

            {modalErr && (
              <div style={{ background: '#fff5f5', color: '#c53030', padding: '10px 16px', fontSize: '0.88rem', borderBottom: '1px solid #fed7d7' }}>
                {modalErr}
              </div>
            )}

            <form onSubmit={handleSaveVillage}>
              <div className="app-modal-body">
                <div className="form-group">
                  <label>Mã định danh <span className="req">*</span></label>
                  <input
                    type="text"
                    required
                    minLength={1}
                    maxLength={50}
                    placeholder="VD: THON_1, TDP_PHU_HOA"
                    value={villageForm.code}
                    onChange={e => setVillageForm(p => ({ ...p, code: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>Tên Thôn / Tổ dân phố <span className="req">*</span></label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    maxLength={255}
                    placeholder="VD: Thôn Bình Thắng, Tổ dân phố 3"
                    value={villageForm.name}
                    onChange={e => setVillageForm(p => ({ ...p, name: e.target.value }))}
                  />
                </div>
              </div>

              <div className="app-modal-footer">
                <button type="button" className="cta-ghost" onClick={() => setVillageModal({ open: false })}>
                  Hủy
                </button>
                <button
                  type="submit"
                  className="cta-btn"
                  disabled={saving}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <Save size={15} />
                  <span>{saving ? 'Đang lưu...' : 'Lưu dữ liệu'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL 3: LĨNH VỰC PHẢN ÁNH */}
      {/* ================================================================= */}
      {categoryModal.open && isAdmin && (
        <div className="app-modal-overlay" onClick={() => setCategoryModal({ open: false })}>
          <div className="app-modal-box" onClick={e => e.stopPropagation()}>
            <div className="app-modal-header">
              <h3>{categoryModal.item ? 'Chỉnh Sửa Lĩnh Vực' : 'Thêm Lĩnh Vực Mới'}</h3>
              <button
                type="button"
                className="app-modal-close-btn"
                onClick={() => setCategoryModal({ open: false })}
              >
                <X size={18} />
              </button>
            </div>

            {modalErr && (
              <div style={{ background: '#fff5f5', color: '#c53030', padding: '10px 16px', fontSize: '0.88rem', borderBottom: '1px solid #fed7d7' }}>
                {modalErr}
              </div>
            )}

            <form onSubmit={handleSaveCategory}>
              <div className="app-modal-body">
                <div className="form-group">
                  <label>Mã lĩnh vực <span className="req">*</span></label>
                  <input
                    type="text"
                    required
                    minLength={1}
                    maxLength={50}
                    placeholder="VD: MT, CSVC, ANTT"
                    value={categoryForm.code}
                    onChange={e => setCategoryForm(p => ({ ...p, code: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>Tên lĩnh vực <span className="req">*</span></label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    maxLength={255}
                    placeholder="VD: Môi trường & Rác thải, An ninh trật tự"
                    value={categoryForm.name}
                    onChange={e => setCategoryForm(p => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label>Mô tả ghi chú (tùy chọn)</label>
                  <textarea
                    rows={3}
                    placeholder="Mô tả tóm tắt phạm vi tiếp nhận ý kiến..."
                    value={categoryForm.description}
                    onChange={e => setCategoryForm(p => ({ ...p, description: e.target.value }))}
                  />
                </div>
              </div>

              <div className="app-modal-footer">
                <button type="button" className="cta-ghost" onClick={() => setCategoryModal({ open: false })}>
                  Hủy
                </button>
                <button
                  type="submit"
                  className="cta-btn"
                  disabled={saving}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <Save size={15} />
                  <span>{saving ? 'Đang lưu...' : 'Lưu dữ liệu'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
