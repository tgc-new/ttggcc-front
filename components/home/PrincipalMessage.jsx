'use client';
import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaUserTie } from 'react-icons/fa';
import { useSiteData } from '../../lib/SiteDataContext';

export default function PrincipalMessage({ type = 'principal' }) {
  const { settings, loaded, ensureLoaded } = useSiteData();
  useEffect(() => { ensureLoaded(); }, [ensureLoaded]);

  const isPrincipal  = type === 'principal';
  const name         = isPrincipal ? (settings?.principalNameBn  || settings?.principalName)  : (settings?.chairmanNameBn  || settings?.chairmanName);
  const designation  = isPrincipal ?  settings?.principalDesignation  :  settings?.chairmanDesignation;
  const photo        = isPrincipal ?  settings?.principalPhoto?.url   :  settings?.chairmanPhoto?.url;
  const sectionTitle = isPrincipal ? 'সভাপতির বাণী' : 'অধ্যক্ষের বাণী';

  if (!loaded) {
    return (
      <div className="card overflow-hidden animate-pulse">
        <div className="h-10 bg-gray-200"/>
        <div className="pt-4 pb-2 flex justify-center bg-gray-50">
          <div className="w-32 bg-gray-200" style={{ aspectRatio:'3/4' }}/>
        </div>
        <div className="p-4 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"/>
          <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto"/>
        </div>
      </div>
    );
  }

  if (!name && !photo) return null;

  return (
    <div className="card overflow-hidden">
      <div className="section-title">{sectionTitle}</div>

      {/* Passport-style photo: 3:4 portrait, small & centered like a real ID photo */}
      <div className="pt-4 pb-2 flex justify-center bg-gray-50">
        <div className="relative w-32 flex-shrink-0 bg-gray-100 border-2 border-white shadow-md ring-1 ring-gray-200"
          style={{ aspectRatio:'3/4' }}>
          {photo ? (
            <Image src={photo} alt={name || sectionTitle} fill className="object-cover" sizes="128px"/>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FaUserTie className="text-gray-300" size={32}/>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 text-center">
        {name && <h3 className="font-bold text-gray-800 text-sm leading-tight">{name}</h3>}
        {designation && <p className="text-xs text-gray-500 mt-1">{designation}</p>}
        <Link href={`/about#${type}`}
          className="mt-2 text-xs hover:underline font-medium inline-flex items-center gap-1"
          style={{ color:'#1565C0' }}>
          View Details →
        </Link>
      </div>
    </div>
  );
}
