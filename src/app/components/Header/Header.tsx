import React from 'react'
import { HeaderClient } from './HeaderClient';
import { frontspace } from '@/lib/frontspace/client';
import { fetchHuvudpartners } from '@/lib/frontspace/adapters/partners';

const Header = async () => {
    // Fetch menu and partners from Frontspace
    const [huvudmeny, huvudpartners] = await Promise.all([
        frontspace.menus.getHuvudmeny(),
        fetchHuvudpartners(),
    ]);

    const socialMedia = [
        { id: '1', platform: 'Facebook', url: 'https://www.facebook.com/ostersif' },
        { id: '2', platform: 'Instagram', url: 'https://www.instagram.com/ostersif' },
        { id: '3', platform: 'TikTok', url: 'https://www.tiktok.com/@ostersif' },
        { id: '4', platform: 'Youtube', url: 'https://www.youtube.com/@ostersif' },
        { id: '5', platform: 'X', url: 'https://twitter.com/ostersif' },
    ];

    return (
        <HeaderClient
            menuItems={huvudmeny?.items || []}
            socialMedia={socialMedia}
            huvudpartners={huvudpartners}
        />
    )
}

export default Header