import styled from '@emotion/styled';


const HeaderWrapper = styled.div`
  display: flex;
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  background-color: ${({ theme }) => theme.headerColor};
  padding: 10px 20px;
  margin: 0 auto;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
`;

const Title = styled.div`
  font-size: 21px;
  font-weight: 600;
  color: ${({ theme }) => theme.textColor};
`;

const DarkMode = styled.button`
  background-color: ${({ theme }) => theme.foregroundColor};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.textColor};
  border: 1px solid #bbbbbb;
  padding: 5px 10px;
`;


const Header = ({ 
  currentTheme,
  updateTheme
}) => {
  return (
    <HeaderWrapper>
      <Title>縣市即時天氣資訊</Title>
      <DarkMode onClick={updateTheme}>
        { currentTheme==="light" ? "深" : "淺" }色模式
      </DarkMode>
    </HeaderWrapper>
  )
};

export default Header;
