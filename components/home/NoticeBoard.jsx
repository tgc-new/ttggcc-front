'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaFilePdf, FaBell, FaCaretRight, FaGoogleDrive } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { noticesAPI } from '../../lib/api';

export default function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    noticesAPI.getAll({ limit: 8 })
      .then(r => setNotices(r.data || []))
      .catch(()=>{})
      .finally(()=>setLoading(false));
  }, []);

  return (
    <div className="card overflow-hidden">
      <div className="section-title">
        <FaBell className="text-yellow-300" size={16}/>
        <span>Notice Board</span>
      </div>

      <div className="divide-y divide-gray-100">
        {loading ? (
          [...Array(6)].map((_,i)=>(
            <div key={i} className="px-4 py-3 flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-200 flex-shrink-0"/>
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 bg-gray-200 animate-pulse rounded w-4/5"/>
                <div className="h-2.5 bg-gray-100 animate-pulse rounded w-1/4"/>
              </div>
            </div>
          ))
        ) : notices.length === 0 ? (
          <p className="p-6 text-center text-gray-400 text-sm">কোনো নোটিশ নেই</p>
        ) : (
          notices.map((notice, i) => (
            <motion.div key={notice._id}
              initial={{ opacity:0, x:-10 }}
              animate={{ opacity:1, x:0 }}
              transition={{ delay:i*0.04 }}
              className="flex items-start gap-2.5 px-4 py-3 hover:bg-green-50 transition-colors group">
              <FaCaretRight className="text-green-600 mt-1 flex-shrink-0" size={14}/>
              <div className="flex-1 min-w-0">
                <Link href={`/notice/${notice._id}`}
                  className="text-sm font-medium leading-snug line-clamp-2 hover:underline"
                  style={{ color:'#1565C0' }}>
                  {notice.titleBn || notice.title}
                </Link>
                <span className="block text-xs text-gray-400 mt-0.5">
                  {format(new Date(notice.publishDate),'dd/MM/yyyy')}
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {notice.isNewNotice && <span className="badge-new">নতুন</span>}
                {notice.isImportant && <span className="badge-important">জরুরি</span>}
                {notice.googleDriveLink && (
                  <a href={notice.googleDriveLink} target="_blank" rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 transition-colors" title="Google Drive">
                    <FaGoogleDrive size={14}/>
                  </a>
                )}
                {notice.pdfFile?.url && !notice.googleDriveLink && (
                  <a href={notice.pdfFile.url} target="_blank" rel="noopener noreferrer"
                    className="text-red-500 hover:text-red-600 transition-colors" title="PDF">
                    <FaFilePdf size={14}/>
                  </a>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="p-3 bg-gray-50 border-t text-center">
        <Link href="/notice" className="btn-primary rounded-full text-sm inline-flex items-center gap-2 py-1.5 px-5">
          আরও দেখুন »
        </Link>
      </div>
    </div>
  );
}
