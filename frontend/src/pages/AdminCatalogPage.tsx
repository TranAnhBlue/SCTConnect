import React, { useState, useEffect } from 'react';
import { villageService } from '../services/villageService';
import { categoryService } from '../services/categoryService';
import apiClient from '../services/api';
import { IVillage, ICategory } from '../types/api';
import {
  MapPin,
  Tag,
  PlusCircle,
  Pencil,
  CheckCircle2,
  XCircle,
  Save,
  X
} from 'lucide-react';

// ─── Village Form Modal ──────────────────────────────────────────
const VillageModal: React.FC<{
  initial?: IVillage | null;
  onClose: () => void;
  onSaved: () => void;
}> = ({ initial, onClose, onSaved }) => {
  const [code, setCode] = useState(initial?.code || '');
  const [name, setName] = useState(initial?.name || '');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) { setErr('Vui lòng điền đầy đủ thông tin'); return; }
    setLoading(true);
    setErr('');
    try {
      if (initial) {
        await apiClient.patch(`/villages/${initial.id}`, { code: code.trim(), name: name.trim() });
      } else {
        await apiClient.post('/villages', { code: code.trim(), name: name.trim() });
      }
      onSaved();
      onClose();
    } catch (e: any) {
      setErr(e?.response?.data?.message || 'Thao tác thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }} onClick={onClose}>
      <div style={{ background: 'var(--surface)', borderRadius: 16, padding: 28, width: 420, maxWidth: '95vw' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0 }}>{initial ? 'Sửa Thôn / TDP' : 'Thêm Thôn / TDP mới'}</h3>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>✕</button>
        </div>
        {err && <div style={{ background: '#fff5f5', color: '#c53030', padding: '10px 14px', borderRadius: 8, marginBottom: 14, fontSize: '0.88rem' }}>{err}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Mã <span className="req">*</span></label>
            <input type="text" required minLength={1} maxLength={50} value={code}
              onChange={e => setCode(e.target.value)} placeholder="VD: THON_1, TO_DAN_PHO_A" />
          </div>
          <div className="form-group">
            <label>Tên Thôn / Tổ dân phố <span className="req">*</span></label>
            <input type="text" required minLength={2} maxLength={255} value={name}
              onChange={e => setName(e.target.value)} placeholder="VD: Thôn 1, Tổ dân phố Bình An" />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
            <button type="button" className="cta-ghost" onClick={onClose}>Hủy</button>
            <button type="submit" className="cta-btn" disabled={loading}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Save size={15} /> {loading ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Category Form Modal ─────────────────────────────────────────
const CategoryModal: React.FC<{
  initial?: ICategory | null;
  onClose: () => void;
  onSaved: () => void;
}> = ({ initial, onClose, onSaved }) => {
  const [code, setCode] = useState(initial?.code || '');
  const [name, setName] = useState(initial?.name || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) { setErr('Vui lòng điền đầy đủ thông tin'); return; }
    setLoading(true);
    setErr('');
    try {
      if (initial) {
        await apiClient.patch(`/categories/${initial.id}`, { code: code.trim(), name: name.trim(), description: description.trim() || undefined });
      } else {
        await apiClient.post('/categories', { code: code.trim(), name: name.trim(), description: description.trim() || undefined });
      }
      onSaved();
      onClose();
    } catch (e: any) {
      setErr(e?.response?.data?.message || 'Thao tác thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }} onClick={onClose}>
      <div style={{ background: 'var(--surface)', borderRadius: 16, padding: 28, width: 460, maxWidth: '95vw' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0 }}>{initial ? 'Sửa Lĩnh vực' : 'Thêm Lĩnh vực mới'}</h3>
          <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>✕</button>
        </div>
        {err && <div style={{ background: '#fff5f5', color: '#c53030', padding: '10px 14px', borderRadius: 8, marginBottom: 14, fontSize: '0.88rem' }}>{err}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Mã lĩnh vực <span className="req">*</span></label>
            <input type="text" required minLength={1} maxLength={50} value={code}
              onChange={e => setCode(e.target.value)} placeholder="VD: CSVC, MTTQ, ANNINH" />
          </div>
          <div className="form-group">
            <label>Tên lĩnh vực <span className="req">*</span></label>
            <input type="text" required minLength={2} maxLength={255} value={name}
              onChange={e => setName(e.target.value)} placeholder="VD: Cơ sở vật chất, An ninh trật tự" />
          </div>
          <div className="form-group">
            <label>Mô tả (tùy chọn)</label>
            <textarea rows={2} value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Mô tả ngắn về lĩnh vực phản ánh này..." />
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
            <button type="button" className="cta-ghost" onClick={onClose}>Hủy</button>
            <button type="submit" className="cta-btn" disabled={loading}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Save size={15} /> {loading ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────
export const AdminCatalogPage: React.FC = () => {
  const [tab, setTab] = useState<'villages' | 'categories'>('villages');
  const [villages, setVillages] = useState<IVillage[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);

  const [villageModal, setVillageModal] = useState<{ open: boolean; item?: IVillage | null }>({ open: false });
  const [categoryModal, setCategoryModal] = useState<{ open: boolean; item?: ICategory | null }>({ open: false });

  const loadData = async () => {
    setLoading(true);
    const [v, c] = await Promise.all([
      villageService.getVillages(),
      categoryService.getCategories()
    ]);
    setVillages(v);
    setCategories(c);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const toggleVillageActive = async (v: IVillage) => {
    await apiClient.patch(`/villages/${v.id}`, { isActive: !v.isActive });
    setVillages(prev => prev.map(x => x.id === v.id ? { ...x, isActive: !x.isActive } : x));
  };

  const toggleCategoryActive = async (c: ICategory) => {
    await apiClient.patch(`/categories/${c.id}`, { isActive: !c.isActive });
    setCategories(prev => prev.map(x => x.id === c.id ? { ...x, isActive: !x.isActive } : x));
  };

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h2>Danh Mục Hệ Thống</h2>
          <p className="page-sub">Quản lý Thôn / Tổ dân phố và Lĩnh vực phản ánh toàn xã</p>
        </div>
        <button
          type="button"
          className="cta-btn"
          onClick={() => tab === 'villages'
            ? setVillageModal({ open: true, item: null })
            : setCategoryModal({ open: true, item: null })}
        >
          <PlusCircle size={16} />
          <span>{tab === 'villages' ? 'Thêm Thôn / TDP' : 'Thêm Lĩnh vực'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
        <button type="button" className={`tab-btn ${tab === 'villages' ? 'active' : ''}`}
          onClick={() => setTab('villages')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <MapPin size={15} /> Thôn / TDP ({villages.length})
        </button>
        <button type="button" className={`tab-btn ${tab === 'categories' ? 'active' : ''}`}
          onClick={() => setTab('categories')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Tag size={15} /> Lĩnh vực ({categories.length})
        </button>
      </div>

      {/* Villages Table */}
      {tab === 'villages' && (
        <div className="card">
          {loading ? (
            <div className="loading-state"><div className="spinner" /><p>Đang tải...</p></div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Mã</th>
                  <th>Tên Thôn / Tổ dân phố</th>
                  <th style={{ textAlign: 'center' }}>Trạng thái</th>
                  <th style={{ textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {villages.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32, color: 'var(--ink-soft)' }}>Chưa có Thôn / TDP nào</td></tr>
                ) : villages.map((v, i) => (
                  <tr key={v.id} style={{ opacity: v.isActive ? 1 : 0.55 }}>
                    <td style={{ color: 'var(--ink-soft)', fontSize: '0.8rem' }}>{i + 1}</td>
                    <td><code style={{ fontSize: '0.82rem' }}>{v.code}</code></td>
                    <td><strong>{v.name}</strong></td>
                    <td style={{ textAlign: 'center' }}>
                      {v.isActive
                        ? <span className="badge badge-success"><CheckCircle2 size={11} /> Hoạt động</span>
                        : <span className="badge badge-neutral"><XCircle size={11} /> Tạm dừng</span>}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button type="button" onClick={() => setVillageModal({ open: true, item: v })}
                          style={{ background: 'none', border: '1px solid var(--line)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <Pencil size={12} /> Sửa
                        </button>
                        <button type="button" onClick={() => toggleVillageActive(v)}
                          style={{
                            background: 'none', border: `1px solid ${v.isActive ? '#feb2b2' : 'var(--line)'}`,
                            color: v.isActive ? '#c53030' : 'var(--ink-soft)',
                            borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: '0.82rem',
                            display: 'inline-flex', alignItems: 'center', gap: 4
                          }}>
                          {v.isActive ? <><X size={12} /> Tạm dừng</> : <><CheckCircle2 size={12} /> Kích hoạt</>}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Categories Table */}
      {tab === 'categories' && (
        <div className="card">
          {loading ? (
            <div className="loading-state"><div className="spinner" /><p>Đang tải...</p></div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Mã</th>
                  <th>Tên Lĩnh vực</th>
                  <th>Mô tả</th>
                  <th style={{ textAlign: 'center' }}>Trạng thái</th>
                  <th style={{ textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', padding: 32, color: 'var(--ink-soft)' }}>Chưa có lĩnh vực nào</td></tr>
                ) : categories.map((c, i) => (
                  <tr key={c.id} style={{ opacity: c.isActive ? 1 : 0.55 }}>
                    <td style={{ color: 'var(--ink-soft)', fontSize: '0.8rem' }}>{i + 1}</td>
                    <td><code style={{ fontSize: '0.82rem' }}>{c.code}</code></td>
                    <td><strong>{c.name}</strong></td>
                    <td style={{ fontSize: '0.84rem', color: 'var(--ink-soft)', maxWidth: 200 }}>{c.description || '—'}</td>
                    <td style={{ textAlign: 'center' }}>
                      {c.isActive
                        ? <span className="badge badge-success"><CheckCircle2 size={11} /> Hoạt động</span>
                        : <span className="badge badge-neutral"><XCircle size={11} /> Tạm dừng</span>}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button type="button" onClick={() => setCategoryModal({ open: true, item: c })}
                          style={{ background: 'none', border: '1px solid var(--line)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <Pencil size={12} /> Sửa
                        </button>
                        <button type="button" onClick={() => toggleCategoryActive(c)}
                          style={{
                            background: 'none', border: `1px solid ${c.isActive ? '#feb2b2' : 'var(--line)'}`,
                            color: c.isActive ? '#c53030' : 'var(--ink-soft)',
                            borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: '0.82rem',
                            display: 'inline-flex', alignItems: 'center', gap: 4
                          }}>
                          {c.isActive ? <><X size={12} /> Tạm dừng</> : <><CheckCircle2 size={12} /> Kích hoạt</>}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Modals */}
      {villageModal.open && (
        <VillageModal
          initial={villageModal.item}
          onClose={() => setVillageModal({ open: false })}
          onSaved={loadData}
        />
      )}
      {categoryModal.open && (
        <CategoryModal
          initial={categoryModal.item}
          onClose={() => setCategoryModal({ open: false })}
          onSaved={loadData}
        />
      )}
    </div>
  );
};
