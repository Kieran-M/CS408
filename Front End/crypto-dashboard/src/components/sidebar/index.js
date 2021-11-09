import React from 'react'
import { SidebarContainer, Icon, CloseIcon, SidebarWrapper, SidebarMenu, SidebarLink, SideBtnWrap, SidebarRoute } from './sidebarElements'
const Sidebar = ({ isOpen, toggle}) => {
    return (
        <SidebarContainer isOpen={isOpen} onClick={toggle}>
            <Icon onClick={toggle}>
                <CloseIcon />
            </Icon>
            <SidebarWrapper>
                <SidebarMenu>
                    <SidebarLink to="/">
                        Market
                    </SidebarLink>
                    <SidebarLink to="/portfolio">
                        Portfolio
                    </SidebarLink>
                    <SidebarLink to="/bots">
                        Bots
                    </SidebarLink>
                    <SideBtnWrap>
                    <SidebarRoute to="/authenticate">
                        Sign In
                    </SidebarRoute>
                    </SideBtnWrap>
                </SidebarMenu>
            </SidebarWrapper>
        </SidebarContainer>
    )
}

export default Sidebar
