'use client';
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import {
  FaPhone, FaEnvelope, FaUserTie, FaSearch,  FaEye, FaTimes,
  FaGraduationCap, FaBriefcase, FaBuilding, FaChevronLeft, FaChevronRight,
  FaUsers, FaCalendarAlt, FaIdCard, FaFilter,
} from 'react-icons/fa';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import toast from 'react-hot-toast';
import { teachersAPI } from '../../lib/api';
import { useSiteData } from '../../lib/SiteDataContext';
import styles from './teachers.module.css';

/* ── Config ───────────────────────────────────────────────── */
const PER_PAGE_OPTIONS = [10, 25, 50, 'all'];
const TYPE_TABS = [
  { value: 'all', label: 'সকল শিক্ষক' },
];
const UNSPECIFIED = '__unspecified__';

/* ── Small helpers ────────────────────────────────────────── */
const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const toBn = (n) => String(n).replace(/[0-9]/g, (d) => BN_DIGITS[d]);

const MONTHS_BN = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
function formatDateBn(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return `${toBn(d.getDate())} ${MONTHS_BN[d.getMonth()]}, ${toBn(d.getFullYear())}`;
}

function buildVCard(teacher, orgName) {
  const name = teacher.nameBn || teacher.name || '';
  const lines = ['BEGIN:VCARD', 'VERSION:3.0', `FN:${name}`, `N:${name};;;;`];
  if (orgName) lines.push(`ORG:${orgName}`);
  const title = teacher.designationBn || teacher.designation;
  if (title) lines.push(`TITLE:${title}`);
  if (teacher.phone) lines.push(`TEL;TYPE=CELL:${teacher.phone}`);
  if (teacher.email) lines.push(`EMAIL:${teacher.email}`);
  if (teacher.department) lines.push(`NOTE:বিভাগ - ${teacher.department}`);
  lines.push('END:VCARD');
  return lines.join('\r\n');
}



/* ── Page ─────────────────────────────────────────────────── */
export default function TeachersPage() {
  const { settings, ensureLoaded } = useSiteData();
  const reduceMotion = useReducedMotion();

  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [activeTeacher, setActiveTeacher] = useState(null);

  useEffect(() => { ensureLoaded(); }, [ensureLoaded]);

  useEffect(() => {
    teachersAPI.getAll()
      .then((r) => setTeachers(r.data || []))
      .catch(() => toast.error('শিক্ষকদের তথ্য লোড হয়নি'))
      .finally(() => setLoading(false));
  }, []);

  // Lock background scroll + allow Escape to close the detail modal
  useEffect(() => {
    document.body.style.overflow = activeTeacher ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [activeTeacher]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setActiveTeacher(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const orgName = settings?.collegeNameEn || settings?.collegeName || '';

  const departments = useMemo(() => {
    const set = new Set();
    let hasUnspecified = false;
    teachers.forEach((t) => {
      if (t.department && t.department.trim()) set.add(t.department.trim());
      else hasUnspecified = true;
    });
    const list = Array.from(set).sort((a, b) => a.localeCompare(b, 'bn'));
    if (hasUnspecified) list.push(UNSPECIFIED);
    return list;
  }, [teachers]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return teachers.filter((t) => {
      if (typeFilter !== 'all' && t.employeeType !== typeFilter) return false;
      if (deptFilter !== 'all') {
        if (deptFilter === UNSPECIFIED) {
          if (t.department && t.department.trim()) return false;
        } else if ((t.department || '').trim() !== deptFilter) return false;
      }
      if (q) {
        const hay = [t.name, t.nameBn, t.designation, t.designationBn, t.department, t.subject]
          .filter(Boolean).join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [teachers, typeFilter, deptFilter, search]);

  // Any change to filters/search/page-size should snap back to page 1
  useEffect(() => { setPage(1); }, [search, typeFilter, deptFilter, perPage]);

  const totalPages = perPage === 'all' ? 1 : Math.max(1, Math.ceil(filtered.length / perPage));
  const pageSafe = Math.min(page, totalPages);

  const paginated = useMemo(() => {
    if (perPage === 'all') return filtered;
    const start = (pageSafe - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, perPage, pageSafe]);

  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const nums = new Set([1, 2, totalPages - 1, totalPages, pageSafe - 1, pageSafe, pageSafe + 1]);
    return Array.from(nums).filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);
  }, [totalPages, pageSafe]);

  const resetFilters = () => { setSearch(''); setTypeFilter('all'); setDeptFilter('all'); };
  const hasActiveFilters = search || typeFilter !== 'all' || deptFilter !== 'all';

  const rowMotion = (i) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: reduceMotion ? { duration: 0 } : { delay: Math.min(i * 0.03, 0.3), duration: 0.35 },
  });

  return (
    <>
      <Navbar />

      <div className="page-header">
        <h1 className="text-3xl font-bold mb-2">শিক্ষকবৃন্দ তালিকা</h1>
        <p className="text-green-200">
          {loading ? 'তথ্য লোড হচ্ছে...' : `মোট ${toBn(teachers.length)} জন শিক্ষক-কর্মচারী`}
        </p>
      </div>

      <div className={`container mx-auto px-4 py-6 ${styles.pageWrap}`}>

        {/* ── Toolbar: search + per-page ── */}
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <FaSearch className={styles.searchIcon} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="নাম, পদবি বা বিভাগ দিয়ে অনুসন্ধান করুন..."
              className={styles.searchInput}
              aria-label="শিক্ষক অনুসন্ধান"
            />
            {search && (
              <button className={styles.clearSearch} onClick={() => setSearch('')} aria-label="অনুসন্ধান মুছুন">
                <FaTimes size={12} />
              </button>
            )}
          </div>

          <div className={styles.perPageWrap}>
            <label className={styles.perPageLabel} htmlFor="perPageSelect">প্রতি পৃষ্ঠায়</label>
            <select
              id="perPageSelect"
              value={perPage}
              onChange={(e) => setPerPage(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className={styles.perPageSelect}
            >
              {PER_PAGE_OPTIONS.map((n) => (
                <option key={n} value={n}>{n === 'all' ? 'সব' : toBn(n)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Employee-type tabs ── */}
        <div className={styles.filterTabs}>
          {TYPE_TABS.map((f) => (
            <button
              key={f.value}
              onClick={() => setTypeFilter(f.value)}
              className={`${styles.filterTab} ${typeFilter === f.value ? styles.filterTabActive : ''}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* ── Department chips ── */}
        {departments.length > 0 && (
          <div className={styles.deptRow}>
            <span className={styles.deptRowLabel}><FaFilter size={11} /> বিভাগ অনুযায়ী</span>
            <div className={styles.deptChips}>
              <button
                onClick={() => setDeptFilter('all')}
                className={`${styles.deptChip} ${deptFilter === 'all' ? styles.deptChipActive : ''}`}
              >
                সকল বিভাগ
              </button>
              {departments.map((d) => (
                <button
                  key={d}
                  onClick={() => setDeptFilter(d)}
                  className={`${styles.deptChip} ${deptFilter === d ? styles.deptChipActive : ''}`}
                >
                  {d === UNSPECIFIED ? 'বিভাগ উল্লেখিত নয়' : d}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Results line ── */}
        <p className={styles.resultsLine}>
          {toBn(filtered.length)} জন শিক্ষক পাওয়া গেছে
          {hasActiveFilters && (
            <button onClick={resetFilters} className={styles.resetBtn}>ফিল্টার মুছুন</button>
          )}
        </p>

        {/* ── Loading skeletons ── */}
        {loading ? (
          <>
            <div className={styles.desktopList}>
              {Array.from({ length: 5 }).map((_, i) => <div key={i} className={styles.skeletonRow} />)}
            </div>
            <div className={styles.mobileGrid}>
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className={styles.skeletonCard} />)}
            </div>
          </>
        ) : filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <FaUsers size={40} className={styles.emptyIcon} />
            <p>কোনো শিক্ষক পাওয়া যায়নি</p>
            {hasActiveFilters && (
              <button onClick={resetFilters} className={styles.resetBtn}>ফিল্টার মুছে সব দেখুন</button>
            )}
          </div>
        ) : (
          <>
            {/* ══ DESKTOP: numbered list rows (md and up) ══ */}
            <div className={styles.desktopList}>
              {paginated.map((t, i) => {
                const serial = perPage === 'all' ? i + 1 : (pageSafe - 1) * perPage + i + 1;
                return (
                  <motion.div key={t._id} {...rowMotion(i)} className={styles.teacherRow}>
                    <div className={styles.rowNumber}>{toBn(serial)}</div>

                    <div className={styles.rowPhoto}>
                      {t.photo?.url ? (
                        <Image src={t.photo.url} alt={t.nameBn || t.name} fill className={styles.rowPhotoImg} sizes="92px" />
                      ) : (
                        <div className={styles.rowPhotoFallback}><FaUserTie size={30} /></div>
                      )}
                      {(t.isPrincipal || t.isVicePrincipal) && (
                        <span className={styles.rowRibbon}>{t.isPrincipal ? 'অধ্যক্ষ' : 'উপ-অধ্যক্ষ'}</span>
                      )}
                    </div>

                    <div className={styles.infoPanel}>
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>নাম</span>
                        <span className={styles.infoValueStrong}>
                          {t.nameBn || t.name}
                          
                        </span>
                      </div>
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>পদবি</span>
                        <span className={styles.infoValue} title={t.designationBn || t.designation}>{t.designationBn || t.designation}</span>
                      </div>
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>বিভাগ</span>
                        <span className={styles.infoValue} title={t.department}>{t.department || '—'}</span>
                      </div>
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>বিষয়</span>
                        <span className={styles.infoValue} title={t.subject}>{t.subject || '—'}</span>
                      </div>
                    </div>

                    <div className={styles.infoPanelSecondary}>
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>প্রতিষ্ঠান</span>
                        <span className={styles.infoValue} title={orgName}>{orgName || '—'}</span>
                      </div>
                      <div className={styles.infoRow}>
                        <span className={styles.infoLabel}>মোবাইল</span>
                        <span className={styles.infoValue}>
                          {t.phone ? <a href={`tel:${t.phone}`} className={styles.linkValue}>{t.phone}</a> : '—'}
                        </span>
                      </div>

                      <div className={styles.rowActions}>
                        
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* ══ MOBILE / TABLET: card grid (below md) ══ */}
            <div className={styles.mobileGrid}>
              {paginated.map((t, i) => (
                <motion.div
                  key={t._id}
                  {...rowMotion(i)}
                  className={styles.teacherCard}
                  onClick={() => setActiveTeacher(t)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') setActiveTeacher(t); }}
                >
                  <div className={styles.cardPhoto}>
                    {t.photo?.url ? (
                      <Image src={t.photo.url} alt={t.nameBn || t.name} fill className={styles.cardPhotoImg} sizes="(max-width: 480px) 45vw, 200px" />
                    ) : (
                      <div className={styles.cardPhotoFallback}><FaUserTie size={34} /></div>
                    )}
                    {(t.isPrincipal || t.isVicePrincipal) && (
                      <span className={styles.cardRibbon}>{t.isPrincipal ? 'অধ্যক্ষ' : 'উপ-অধ্যক্ষ'}</span>
                    )}
                    
                  </div>

                  <div className={styles.cardBody}>
                    <h3 className={styles.cardName}>{t.nameBn || t.name}</h3>
                    <p className={styles.cardDesignation}>{t.designationBn || t.designation}</p>
                    {t.department && <p className={styles.cardDept}>{t.department}</p>}

                    <div className={styles.cardActions} onClick={(e) => e.stopPropagation()}>
                      {t.phone && (
                        <a href={`tel:${t.phone}`} className={`${styles.cardActionBtn} ${styles.callBtn}`} aria-label="কল করুন"><FaPhone size={12} /></a>
                      )}
                      {t.email && (
                        <a href={`mailto:${t.email}`} className={`${styles.cardActionBtn} ${styles.mailBtn}`} aria-label="ইমেইল করুন"><FaEnvelope size={12} /></a>
                      )}
                     
                      <button onClick={() => setActiveTeacher(t)} className={`${styles.cardActionBtn} ${styles.viewBtn}`} aria-label="বিস্তারিত দেখুন"><FaEye size={12} /></button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ── Pagination ── */}
            {perPage !== 'all' && totalPages > 1 && (
              <nav className={styles.pagination} aria-label="পৃষ্ঠা নেভিগেশন">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={pageSafe === 1}
                  className={styles.pageNavBtn}
                  aria-label="পূর্ববর্তী পৃষ্ঠা"
                >
                  <FaChevronLeft size={12} />
                </button>

                {pageNumbers.map((n, idx) => {
                  const prev = pageNumbers[idx - 1];
                  const showEllipsis = prev && n - prev > 1;
                  return (
                    <span key={n} className={styles.pageNumWrap}>
                      {showEllipsis && <span className={styles.pageEllipsis}>…</span>}
                      <button
                        onClick={() => setPage(n)}
                        className={`${styles.pageBtn} ${n === pageSafe ? styles.pageBtnActive : ''}`}
                        aria-current={n === pageSafe ? 'page' : undefined}
                      >
                        {toBn(n)}
                      </button>
                    </span>
                  );
                })}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={pageSafe === totalPages}
                  className={styles.pageNavBtn}
                  aria-label="পরবর্তী পৃষ্ঠা"
                >
                  <FaChevronRight size={12} />
                </button>
              </nav>
            )}
          </>
        )}
      </div>

      {/* ── Detail modal ── */}
      <AnimatePresence>
        {activeTeacher && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className={styles.modalOverlay}
            onClick={() => setActiveTeacher(null)}
          >
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 24, stiffness: 300 }}
              className={styles.modalCard}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={activeTeacher.nameBn || activeTeacher.name}
            >
              <button onClick={() => setActiveTeacher(null)} className={styles.modalClose} aria-label="বন্ধ করুন">
                <FaTimes size={16} />
              </button>

              <div className={styles.modalHeader}>
                <div className={styles.modalPhoto}>
                  {activeTeacher.photo?.url ? (
                    <Image src={activeTeacher.photo.url} alt={activeTeacher.nameBn || activeTeacher.name} fill className={styles.modalPhotoImg} sizes="108px" />
                  ) : (
                    <div className={styles.modalPhotoFallback}><FaUserTie size={44} /></div>
                  )}
                </div>
                <h2 className={styles.modalName}>{activeTeacher.nameBn || activeTeacher.name}</h2>
                <p className={styles.modalDesignation}>{activeTeacher.designationBn || activeTeacher.designation}</p>
                {(activeTeacher.isPrincipal || activeTeacher.isVicePrincipal) && (
                  <span className={styles.modalRibbon}>{activeTeacher.isPrincipal ? 'অধ্যক্ষ' : 'উপ-অধ্যক্ষ'}</span>
                )}
              </div>

              <div className={styles.modalBody}>
                {[
                  { icon: <FaBuilding size={13} />, label: 'বিভাগ', value: activeTeacher.department },
                  { icon: <FaBriefcase size={13} />, label: 'বিষয়', value: activeTeacher.subject },
                  { icon: <FaGraduationCap size={13} />, label: 'যোগ্যতা', value: activeTeacher.qualification },
                  { icon: <FaIdCard size={13} />, label: 'অভিজ্ঞতা', value: activeTeacher.experience },
                  { icon: <FaBuilding size={13} />, label: 'প্রতিষ্ঠান', value: orgName },
                  { icon: <FaCalendarAlt size={13} />, label: 'যোগদান', value: formatDateBn(activeTeacher.joinDate) },
                ].filter((r) => r.value).map((r) => (
                  <div key={r.label} className={styles.modalRow}>
                    <span className={styles.modalRowIcon}>{r.icon}</span>
                    <span className={styles.modalRowLabel}>{r.label}</span>
                    <span className={styles.modalRowValue}>{r.value}</span>
                  </div>
                ))}
              </div>

              <div className={styles.modalActions}>
                {activeTeacher.phone && (
                  <a href={`tel:${activeTeacher.phone}`} className={styles.modalActionBtn}><FaPhone size={13} /> কল করুন</a>
                )}
                {activeTeacher.email && (
                  <a href={`mailto:${activeTeacher.email}`} className={styles.modalActionBtnOutline}><FaEnvelope size={13} /> ইমেইল</a>
                )}
                
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
