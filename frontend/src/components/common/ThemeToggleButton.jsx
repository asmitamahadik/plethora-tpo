import { Button } from 'antd';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { useThemeMode } from '../../theme/ThemeContext';

export default function ThemeToggleButton() {
  const { mode, setMode } = useThemeMode();
  const isDark = mode === 'dark';

  return (
    <Button
      shape="circle"
      type="text"
      onClick={() => setMode(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span key={mode} className="theme-toggle-icon">
        {isDark ? <SunOutlined /> : <MoonOutlined />}
      </span>
    </Button>
  );
}
