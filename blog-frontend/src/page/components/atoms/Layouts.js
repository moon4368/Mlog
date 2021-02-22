import styled from 'styled-components';

export const LayoutHeight = styled.div`
  min-height : calc(100vh - 12.8rem);
`;


export const Layout = styled.div`
  width : 71.25rem;
  margin : 0 auto;
  @media screen and (max-width:1200px){
    width : 60rem;
  }
  @media screen and (max-width:990px){
    width : calc(100% - 5rem);
    width : -webkit-calc(100% - 5rem);
    width : -moz-clac(100% -5rem);
  }
  @media screen and (max-width:768px){
    width : calc(100% - 5rem);
    width : -webkit-calc(100% - 5rem);
    width : -moz-calc(100% -5rem);
  }

  @media screen and (max-width:510px){
    width : calc(100% - 2rem);
    width : -webkit-calc(100% - 2rem);
    width : -moz-calc(100% -2rem);
  }
`;

export const PostLayout = styled(Layout)`
  width : 60rem;
  padding-top : 3rem;
  @media screen and (max-width:990px){
    width : calc(100% - 5rem);
    width : -webkit-calc(100% - 5rem);
    width : -moz-clac(100% -5rem);
  }
  @media screen and (max-width:768px){
    width : calc(100% - 5rem);
    width : -webkit-calc(100% - 5rem);
    width : -moz-calc(100% -5rem);
  }

  @media screen and (max-width:510px){
    width : calc(100% - 2rem);
    width : -webkit-calc(100% - 2rem);
    width : -moz-calc(100% -2rem);
  }
`;



export const HeaderLayout = styled(Layout)`
  height : 3rem;
  display : flex;
  justify-content : space-between;
  align-items:flex-end;
  
`;

export const MenuLayout = styled(Layout)`
  padding-top : 1rem;
  font-size : 1rem;
  display : flex;
  justify-content:space-between;
  align-items: flex-start;
`;

export const CardsLayout = styled(Layout)`
  padding-top : .5rem;
  display : flex;
  flex-wrap : wrap;
  
  @media screen and (max-width:990px){
    flex-direction : column;
  }
`;

export const PostViewLayout = styled(Layout)`
  width : 50rem;
  padding-top : 3rem;
  @media screen and (max-width:990px){
    width : calc(100% - 5rem);
    width : -webkit-calc(100% - 5rem);
    width : -moz-clac(100% -5rem);
  }
  @media screen and (max-width:768px){
    width : calc(100% - 5rem);
    width : -webkit-calc(100% - 5rem);
    width : -moz-calc(100% -5rem);
  }

  @media screen and (max-width:510px){
    width : calc(100% - 2rem);
    width : -webkit-calc(100% - 2rem);
    width : -moz-calc(100% -2rem);
  }
`;

export const CommentLayout = styled.div`
  width : calc(100% - 2rem);
  margin : 0 auto;
`;

export const UserPageLayout = styled(Layout)`
  margin-top : 1rem;
`;

export const ModalBackLayout = styled.div`
  width : 100vw;
  height : 100vh;
  display : flex;
  flex-direction : column;
  justify-content : center;
  align-items : center;
  position : absolute;
  top:0;
  backdrop-filter : blur(2px);
  z-index : 5;
`;