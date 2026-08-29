import React, { useState, useEffect } from 'react';
import { organizationService } from '../services/organizationService';
import { useAuth } from '../context/AuthContext';
import { IOrganization } from '../types/api';
import {
  GitFork,
  Search,
  Building2,
  ChevronRight,
  ChevronDown,
  Layers,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Pencil,
  Save,
  X
} from 'lucide-react';

// Recursive tree node component
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
            Mã: {node.code} · Loại: {node.type === 'fatherland_front' ? 'Mặt trận Tổ quốc' : node.type === 'union' ? 'Đoàn thể' : 'Khác'}
          </div>
        </div>
        <span className={`badge ${node.isActive ? 'badge-success' : 'badge-neutral'}`}
          style={{ fontSize: '0.72rem' }}>
          {node.isActive ? 'Hoạt động' : 'Tạm dừng'}
        </span>

        {isAdmin && (
          <div style={{ display: 'inline-flex', gap: 6, marginLeft: 8 }}>
            <button
              type="button"
              onClick={() => onEdit?.(node)}
              style={{
                background: '#fff', border: '1px solid var(--line)', borderRadius: 6,
                padding: '4px 8px', cursor: 'pointer', fontSize: '0.78rem',
                display: 'inline-flex', alignItems: 'center', gap: 4
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
                borderRadius: 6, padding: '4px 8px', cursor: 'pointer', fontSize: '0.78rem',
                display: 'inline-flex', alignItems: 'center', gap: 4
              }}
            >
              {node.isActive ? <><X size={12} /> Tạm dừng</> : <><CheckCircle2 size={12} /> Kích hoạt</>}
            </button>
          </div>
        )}
      </div>

      {expanded && hasChildren && node.children!.map(child => (
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

export const OrganizationsPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user.userType === 'admin';

  const [activeTab, setActiveTab] = useState<'tree' | 'flat'>('tree');
  const [treeData, setTreeData] = useState<IOrganization[]>([]);
  const [flatData, setFlatData] = useState<IOrganization[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal Thêm / Sửa tổ chức
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<IOrganization | null>(null);
  const [orgForm, setOrgForm] = useState({
    code: '',
    name: '',
    type: 'union' as 'fatherland_front' | 'union' | 'other'
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formErr, setFormErr] = useState('');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [tree, flat] = await Promise.all([
        organizationService.getTree(),
        organizationService.getList()
      ]);
      setTreeData(tree);
      setFlatData(flat);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingOrg(null);
    setOrgForm({ code: '', name: '', type: 'union' });
    setFormErr('');
    setModalOpen(true);
  };

  const handleOpenEdit = (org: IOrganization) => {
    setEditingOrg(org);
    setOrgForm({
      code: org.code,
      name: org.name,
      type: org.type || 'union'
    });
    setFormErr('');
    setModalOpen(true);
  };

  const handleToggleStatus = async (org: IOrganization) => {
    try {
      await organizationService.update(org.id, { isActive: !org.isActive });
      await loadAllData();
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Cập nhật trạng thái thất bại');
    }
  };

  const handleSubmitModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgForm.code.trim() || !orgForm.name.trim()) {
      setFormErr('Vui lòng điền mã và tên tổ chức');
      return;
    }
    setFormLoading(true);
    setFormErr('');
    try {
      if (editingOrg) {
        // Cập nhật: PATCH /organizations/:id
        await organizationService.update(editingOrg.id, {
          name: orgForm.name.trim(),
          type: orgForm.type
        });
      } else {
        // Tạo mới: POST /organizations
        await organizationService.create({
          code: orgForm.code.trim(),
          name: orgForm.name.trim(),
          type: orgForm.type
        });
      }
      setModalOpen(false);
      await loadAllData();
    } catch (err: any) {
      setFormErr(err?.response?.data?.message || 'Thao tác thất bại');
    } finally {
      setFormLoading(false);
    }
  };

  const filteredFlat = flatData.filter(o =>
    !searchTerm ||
    o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { key: 'tree' as const, label: 'Sơ đồ cây', icon: GitFork },
    { key: 'flat' as const, label: `Danh sách tổ chức (${flatData.length})`, icon: Layers }
  ];

  return (
    <div className="organizations-page">
      <div className="page-header-row">
        <div>
          <h2>Cơ Cấu Tổ Chức Đoàn Thể</h2>
          <p className="page-sub">Sơ đồ và thông tin các Hội đoàn thể trực thuộc Ủy ban Mặt trận Tổ quốc xã</p>
        </div>
        {isAdmin && (
          <button type="button" className="cta-btn" onClick={handleOpenCreate}>
            <PlusCircle size={16} />
            <span>Thêm tổ chức mới</span>
          </button>
        )}
      </div>

      {/* Tab Bar */}
      <div className="tab-bar" style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search for flat tab */}
      {activeTab === 'flat' && (
        <div className="filter-card" style={{ marginBottom: 16 }}>
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Tìm tổ chức theo tên hoặc mã..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button type="button" className="clear-btn" onClick={() => setSearchTerm('')}>✕</button>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Đang tải dữ liệu tổ chức...</p>
        </div>
      ) : (
        <>
          {/* Tree Tab */}
          {activeTab === 'tree' && (
            <div className="card">
              <div style={{ padding: '20px 24px' }}>
                <h3 style={{ marginBottom: 16 }}>Sơ đồ cây cơ cấu tổ chức toàn xã</h3>
                {treeData.length === 0 ? (
                  <div className="empty-state">
                    <GitFork size={36} className="text-muted" />
                    <p>Chưa có dữ liệu cơ cấu tổ chức</p>
                  </div>
                ) : (
                  treeData.map(node => (
                    <OrgTreeNode
                      key={node.id}
                      node={node}
                      depth={0}
                      onEdit={handleOpenEdit}
                      onToggleStatus={handleToggleStatus}
                      isAdmin={isAdmin}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {/* Flat List Tab with Actions */}
          {activeTab === 'flat' && (
            <div className="card">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tên tổ chức</th>
                    <th>Mã</th>
                    <th>Loại</th>
                    <th style={{ textAlign: 'center' }}>Trạng thái</th>
                    {isAdmin && <th style={{ textAlign: 'center' }}>Hành động</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredFlat.length === 0 ? (
                    <tr>
                      <td colSpan={isAdmin ? 6 : 5} style={{ textAlign: 'center', color: 'var(--ink-soft)', padding: 24 }}>
                        Không tìm thấy tổ chức nào
                      </td>
                    </tr>
                  ) : filteredFlat.map((org, index) => (
                    <tr key={org.id} style={{ opacity: org.isActive ? 1 : 0.6 }}>
                      <td style={{ color: 'var(--ink-soft)', fontSize: '0.8rem' }}>{index + 1}</td>
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
                          {org.isActive
                            ? <><CheckCircle2 size={11} /> Hoạt động</>
                            : <><XCircle size={11} /> Tạm dừng</>}
                        </span>
                      </td>
                      {isAdmin && (
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', gap: 6 }}>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(org)}
                              style={{
                                background: '#fff', border: '1px solid var(--line)', borderRadius: 6,
                                padding: '4px 10px', cursor: 'pointer', fontSize: '0.82rem',
                                display: 'inline-flex', alignItems: 'center', gap: 4
                              }}
                              title="Chỉnh sửa tổ chức"
                            >
                              <Pencil size={12} /> Sửa
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleStatus(org)}
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
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Modal Thêm / Chỉnh sửa Tổ chức */}
      {modalOpen && isAdmin && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            style={{
              background: 'var(--surface)', borderRadius: 16, padding: 28,
              width: 440, maxWidth: '95vw'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 style={{ margin: 0 }}>{editingOrg ? 'Chỉnh Sửa Tổ Chức' : 'Tạo Tổ Chức Mới'}</h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}
              >
                ✕
              </button>
            </div>

            {formErr && (
              <div style={{
                background: '#fff5f5', color: '#c53030', padding: '10px 14px',
                borderRadius: 8, marginBottom: 14, fontSize: '0.88rem'
              }}>
                {formErr}
              </div>
            )}

            <form onSubmit={handleSubmitModal}>
              <div className="form-group">
                <label>Mã tổ chức <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  disabled={!!editingOrg} // Khi edit thường backend khóa mã
                  minLength={2}
                  maxLength={50}
                  placeholder="VD: DOAN_TN"
                  value={orgForm.code}
                  onChange={e => setOrgForm(p => ({ ...p, code: e.target.value }))}
                  style={editingOrg ? { background: 'var(--paper)', cursor: 'not-allowed' } : {}}
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
                <label>Loại tổ chức</label>
                <select
                  value={orgForm.type}
                  onChange={e => setOrgForm(p => ({ ...p, type: e.target.value as any }))}
                >
                  <option value="fatherland_front">Mặt trận Tổ quốc</option>
                  <option value="union">Hội / Đoàn thể</option>
                  <option value="other">Khác</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24 }}>
                <button type="button" className="cta-ghost" onClick={() => setModalOpen(false)}>
                  Hủy
                </button>
                <button
                  type="submit"
                  className="cta-btn"
                  disabled={formLoading}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <Save size={15} />
                  {formLoading ? 'Đang lưu...' : 'Lưu dữ liệu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
