// CLEAN FILE REPLACEMENT
import { useState, useEffect, useCallback } from 'react';
import { Tabs, Input, Button, Alert, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { login, register } from '../services/auth';
import { useAuth } from '../contexts/AuthContext';
import '../styles/components/buttons.css';

type Mode = 'login' | 'register';

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setToken, isAuthenticated } = useAuth();

  const [mode, setMode] = useState<Mode>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginValues, setLoginValues] = useState({ username: '', password: '' });
  const [registerValues, setRegisterValues] = useState({ username: '', password: '', password_repeat: '', invite_code: '' });

  // Sync mode with query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const m = params.get('mode');
    setMode(m === 'register' ? 'register' : 'login');
  }, [location.search]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  const changeMode = (next: string) => {
    const params = new URLSearchParams(location.search);
    params.set('mode', next);
    navigate({ pathname: '/auth', search: params.toString() }, { replace: true });
    setError(null);
  };

  const doLogin = useCallback(async () => {
    if (loading) return;
    const { username, password } = loginValues;
    if (!username || !password) {
      setError('Введите логин и пароль');
      return;
    }
    setLoading(true); setError(null);
    try {
      const data = await login({ username: username.trim(), password });
      const token = data?.token || data?.access_token || data?.authToken;
      if (token) setToken(token);
      message.success('Успешный вход');
      navigate('/', { replace: true });
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Ошибка входа');
    } finally { setLoading(false); }
  }, [loading, loginValues, navigate, setToken]);

  const doRegister = useCallback(async () => {
    if (loading) return;
    const { username, password, password_repeat, invite_code } = registerValues;
    if (!username || !password || !password_repeat || !invite_code) {
      setError('Заполните все поля');
      return;
    }
    if (password !== password_repeat) {
      setError('Пароли не совпадают');
      return;
    }
    setLoading(true); setError(null);
    try {
      const data = await register({ username: username.trim(), password, invite_code: invite_code.trim() });
      const token = data?.token || data?.access_token || data?.authToken;
      if (token) {
        setToken(token);
        message.success('Регистрация успешна');
        navigate('/', { replace: true });
      } else {
        message.success('Регистрация успешна, теперь войдите');
        changeMode('login');
      }
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Ошибка регистрации');
    } finally { setLoading(false); }
  }, [loading, registerValues, navigate, setToken]);

  return (
    <div style={{ maxWidth: 420, margin: '80px auto', background: '#132b44', padding: 32, borderRadius: 16, boxShadow: '0 4px 24px -8px #000c' }}>
      <h2 style={{ marginTop: 0, textAlign: 'center' }}>Аккаунт</h2>
      <Tabs
        activeKey={mode}
        onChange={(k) => changeMode(k as Mode)}
        centered
        items={[
          { key: 'login', label: 'Вход' },
          { key: 'register', label: 'Регистрация' },
        ]}
      />
      {error && <Alert type="error" showIcon style={{ marginBottom: 16 }} message={error} />}
      {mode === 'login' ? (
        <form onSubmit={(e) => { e.preventDefault(); doLogin(); }} autoComplete="off">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 13 }}>Логин</span>
              <Input
                autoFocus
                autoComplete="username"
                disabled={loading}
                value={loginValues.username}
                onChange={e => setLoginValues(v => ({ ...v, username: e.target.value }))}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 13 }}>Пароль</span>
              <Input.Password
                autoComplete="current-password"
                disabled={loading}
                value={loginValues.password}
                onChange={e => setLoginValues(v => ({ ...v, password: e.target.value }))}
              />
            </label>
            <Button className="login-btn" htmlType="submit" block loading={loading} style={{ marginTop: 8 }}>Войти</Button>
          </div>
        </form>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); doRegister(); }} autoComplete="off">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 13 }}>Логин</span>
              <Input
                autoFocus
                autoComplete="username"
                disabled={loading}
                value={registerValues.username}
                onChange={e => setRegisterValues(v => ({ ...v, username: e.target.value }))}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 13 }}>Пароль</span>
              <Input.Password
                autoComplete="new-password"
                disabled={loading}
                value={registerValues.password}
                onChange={e => setRegisterValues(v => ({ ...v, password: e.target.value }))}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 13 }}>Повтор пароля</span>
              <Input.Password
                autoComplete="new-password"
                disabled={loading}
                value={registerValues.password_repeat}
                onChange={e => setRegisterValues(v => ({ ...v, password_repeat: e.target.value }))}
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 13 }}>Инвайт код</span>
              <Input
                disabled={loading}
                value={registerValues.invite_code}
                onChange={e => setRegisterValues(v => ({ ...v, invite_code: e.target.value }))}
              />
            </label>
            <Button className="login-btn" htmlType="submit" block loading={loading} style={{ marginTop: 8 }}>Зарегистрироваться</Button>
          </div>
        </form>
      )}
    </div>
  );
}
