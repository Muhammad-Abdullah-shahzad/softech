import React from 'react';
import { Avatar } from '@mantine/core';

export const CompanyLogo = ({ platform, size = 'sm', className = '' }) => {
    const getLogoPath = (name) => {
        const n = (name || '').toLowerCase();
        if (n.includes('uber')) return '/company/uber.png';
        if (n.includes('careem')) return '/company/careem.png';
        if (n.includes('yango')) return '/company/yango.png';
        if (n.includes('bykea')) return '/company/bykea.png';
        if (n.includes('foodpanda')) return '/company/foodpanda.webp';
        if (n.includes('fiverr') || n.includes('fiver')) return '/company/fiver.png';
        if (n.includes('upwork')) return '/company/upwork.png';
        if (n.includes('freelancer')) return '/company/freelancer.webp';
        return null; // fallback to text char
    };

    const logoPath = getLogoPath(platform);
    
    const sizeMap = {
        xs: 16,
        sm: 24,
        md: 32,
        lg: 40,
        xl: 48
    };
    
    const sz = typeof size === 'number' ? size : (sizeMap[size] || 24);

    return (
        <Avatar 
            src={logoPath} 
            alt={platform} 
            size={sz}
            radius="sm"
            color="slate"
            className={`shadow-sm border border-slate-200 bg-white p-[2px] object-contain ${className}`}
        >
            {platform ? platform.charAt(0).toUpperCase() : '?'}
        </Avatar>
    );
};

export const PlatformDisplay = ({ platform, size = 'sm', className = '' }) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <CompanyLogo platform={platform} size={size} />
            <span className="font-bold text-slate-800 uppercase tracking-tighter">{platform}</span>
        </div>
    );
};
