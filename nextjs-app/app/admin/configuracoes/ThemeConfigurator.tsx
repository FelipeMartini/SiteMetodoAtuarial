// Configurador de tema avançado para o painel administrativo
'use client';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { updateTheme, resetTheme, saveThemePreset } from '@/lib/store/slices/themeSlice';
import { addNotification } from '@/lib/store/slices/dashboardSlice';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
  background: ${props => props.theme.colors.background};
  min-height: 100vh;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.text};
  font-size: 2rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
  font-size: 1.1rem;
`;

const ConfigGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ConfigSection = styled.div`
  background: ${props => props.theme.colors.surface};
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const SectionTitle = styled.h2`
  color: ${props => props.theme.colors.text};
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const ColorInput = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: ${props => props.theme.colors.text};
  font-weight: 500;
  font-size: 0.9rem;
`;

const ColorPicker = styled.input`
  width: 100%;
  height: 40px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  cursor: pointer;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`;

const TextInput = styled.input`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 6px;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: ${props.theme.colors.primary};
          color: white;
          &:hover { background: ${props.theme.colors.primaryDark}; }
        `;
      case 'danger':
        return `
          background: #e74c3c;
          color: white;
          &:hover { background: #c0392b; }
        `;
      default:
        return `
          background: ${props.theme.colors.secondary};
          color: ${props.theme.colors.text};
          &:hover { background: ${props.theme.colors.secondaryLight}; }
        `;
    }
  }}
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PreviewSection = styled.div`
  grid-column: 1 / -1;
  background: ${props => props.theme.colors.surface};
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const PreviewCard = styled.div`
  background: ${props => props.theme.colors.background};
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const PreviewTitle = styled.h3`
  color: ${props => props.theme.colors.text};
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
`;

const PreviewText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
`;

const PreviewButton = styled(Button)`
  font-size: 0.8rem;
  padding: 0.5rem 1rem;
`;

const PresetButton = styled.button<{ isActive?: boolean }>`
  padding: 1rem;
  border: 2px solid ${props => props.isActive ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 12px;
  background: ${props => props.theme.colors.surface};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    transform: translateY(-2px);
  }
`;

const PresetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const PresetName = styled.div`
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const PresetColors = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 0.5rem;
`;

const PresetColor = styled.div<{ color: string }>`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: ${props => props.color};
  border: 1px solid ${props => props.theme.colors.border};
`;

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Slider = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: ${props => props.theme.colors.secondary};
  outline: none;
  
  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.theme.colors.primary};
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.theme.colors.primary};
    cursor: pointer;
    border: none;
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 1rem 0;
`;

const Toggle = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
`;

const ToggleSlider = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + span {
    background-color: ${props => props.theme.colors.primary};
  }
  
  &:checked + span:before {
    transform: translateX(26px);
  }
`;

const ToggleSpan = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.theme.colors.secondary};
  transition: .4s;
  border-radius: 24px;
  
  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
`;

const ThemeConfigurator: React.FC = () => {
  const dispatch = useDispatch();
  const { currentTheme, themes } = useSelector((state: RootState) => state.theme);

  const [tempTheme, setTempTheme] = useState(currentTheme);
  const [presetName, setPresetName] = useState('');

  const handleColorChange = (colorKey: string, value: string) => {
    setTempTheme(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: value
      }
    }));
  };

  const handleFontChange = (fontKey: string, value: string) => {
    setTempTheme(prev => ({
      ...prev,
      fonts: {
        ...prev.fonts,
        [fontKey]: value
      }
    }));
  };

  const handleSpacingChange = (spacingKey: string, value: number) => {
    setTempTheme(prev => ({
      ...prev,
      spacing: {
        ...prev.spacing,
        [spacingKey]: value
      }
    }));
  };

  const handleBorderRadiusChange = (value: number) => {
    setTempTheme(prev => ({
      ...prev,
      borderRadius: {
        ...prev.borderRadius,
        default: `${value}px`
      }
    }));
  };

  const handleShadowToggle = (enabled: boolean) => {
    setTempTheme(prev => ({
      ...prev,
      shadows: {
        ...prev.shadows,
        enabled
      }
    }));
  };

  const applyTheme = () => {
    dispatch(updateTheme(tempTheme));
    dispatch(addNotification({
      title: 'Tema aplicado',
      message: 'As configurações do tema foram aplicadas com sucesso',
      type: 'success'
    }));
  };

  const resetToDefault = () => {
    dispatch(resetTheme());
    setTempTheme(themes.light); // Reset para tema padrão
    dispatch(addNotification({
      title: 'Tema resetado',
      message: 'O tema foi restaurado para as configurações padrão',
      type: 'info'
    }));
  };

  const savePreset = () => {
    if (!presetName.trim()) {
      dispatch(addNotification({
        title: 'Nome obrigatório',
        message: 'Por favor, forneça um nome para o preset',
        type: 'warning'
      }));
      return;
    }

    dispatch(saveThemePreset({ name: presetName, theme: tempTheme }));
    dispatch(addNotification({
      title: 'Preset salvo',
      message: `Preset "${presetName}" foi salvo com sucesso`,
      type: 'success'
    }));
    setPresetName('');
  };

  const loadPreset = (themeName: string) => {
    const theme = themes[themeName];
    if (theme) {
      setTempTheme(theme);
      dispatch(updateTheme(theme));
      dispatch(addNotification({
        title: 'Preset carregado',
        message: `Tema "${themeName}" foi carregado`,
        type: 'success'
      }));
    }
  };

  return (
    <Container>
      <Header>
        <Title>🎨 Configurador de Tema</Title>
        <Subtitle>
          Personalize a aparência do dashboard com cores, fontes e espaçamentos
        </Subtitle>
      </Header>

      <ConfigGrid>
        {/* Presets de Tema */}
        <ConfigSection>
          <SectionTitle>📚 Presets de Tema</SectionTitle>
          <PresetGrid>
            {Object.entries(themes).map(([name, theme]) => (
              <PresetButton
                key={name}
                isActive={tempTheme.name === name}
                onClick={() => loadPreset(name)}
              >
                <PresetName>{theme.name}</PresetName>
                <PresetColors>
                  <PresetColor color={theme.colors.primary} />
                  <PresetColor color={theme.colors.secondary} />
                  <PresetColor color={theme.colors.background} />
                  <PresetColor color={theme.colors.text} />
                </PresetColors>
              </PresetButton>
            ))}
          </PresetGrid>

          <div style={{ marginTop: '1rem' }}>
            <TextInput
              placeholder="Nome do novo preset..."
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
            />
            <Button
              variant="primary"
              onClick={savePreset}
              style={{ marginTop: '0.5rem', width: '100%' }}
            >
              💾 Salvar Preset Atual
            </Button>
          </div>
        </ConfigSection>

        {/* Cores Principais */}
        <ConfigSection>
          <SectionTitle>🎨 Cores Principais</SectionTitle>
          <ColorGrid>
            <ColorInput>
              <Label>Cor Primária</Label>
              <ColorPicker
                type="color"
                value={tempTheme.colors.primary}
                onChange={(e) => handleColorChange('primary', e.target.value)}
              />
            </ColorInput>

            <ColorInput>
              <Label>Cor Secundária</Label>
              <ColorPicker
                type="color"
                value={tempTheme.colors.secondary}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
              />
            </ColorInput>

            <ColorInput>
              <Label>Fundo Principal</Label>
              <ColorPicker
                type="color"
                value={tempTheme.colors.background}
                onChange={(e) => handleColorChange('background', e.target.value)}
              />
            </ColorInput>

            <ColorInput>
              <Label>Fundo Superfície</Label>
              <ColorPicker
                type="color"
                value={tempTheme.colors.surface}
                onChange={(e) => handleColorChange('surface', e.target.value)}
              />
            </ColorInput>

            <ColorInput>
              <Label>Texto Principal</Label>
              <ColorPicker
                type="color"
                value={tempTheme.colors.text}
                onChange={(e) => handleColorChange('text', e.target.value)}
              />
            </ColorInput>

            <ColorInput>
              <Label>Texto Secundário</Label>
              <ColorPicker
                type="color"
                value={tempTheme.colors.textSecondary}
                onChange={(e) => handleColorChange('textSecondary', e.target.value)}
              />
            </ColorInput>
          </ColorGrid>
        </ConfigSection>

        {/* Fontes */}
        <ConfigSection>
          <SectionTitle>📝 Tipografia</SectionTitle>
          <ColorInput>
            <Label>Fonte Principal</Label>
            <TextInput
              value={tempTheme.fonts.primary}
              onChange={(e) => handleFontChange('primary', e.target.value)}
              placeholder="Inter, Arial, sans-serif"
            />
          </ColorInput>

          <ColorInput style={{ marginTop: '1rem' }}>
            <Label>Fonte Monoespaçada</Label>
            <TextInput
              value={tempTheme.fonts.mono}
              onChange={(e) => handleFontChange('mono', e.target.value)}
              placeholder="'Fira Code', Monaco, monospace"
            />
          </ColorInput>
        </ConfigSection>

        {/* Espaçamentos e Layout */}
        <ConfigSection>
          <SectionTitle>📐 Layout e Espaçamento</SectionTitle>

          <SliderContainer>
            <Label>Raio da Borda: {parseInt(tempTheme.borderRadius.default)}px</Label>
            <Slider
              type="range"
              min="0"
              max="20"
              value={parseInt(tempTheme.borderRadius.default)}
              onChange={(e) => handleBorderRadiusChange(parseInt(e.target.value))}
            />
          </SliderContainer>

          <SliderContainer style={{ marginTop: '1rem' }}>
            <Label>Espaçamento Pequeno: {tempTheme.spacing.sm}</Label>
            <Slider
              type="range"
              min="2"
              max="16"
              value={parseInt(tempTheme.spacing.sm)}
              onChange={(e) => handleSpacingChange('sm', parseInt(e.target.value))}
            />
          </SliderContainer>

          <SliderContainer style={{ marginTop: '1rem' }}>
            <Label>Espaçamento Médio: {tempTheme.spacing.md}</Label>
            <Slider
              type="range"
              min="8"
              max="32"
              value={parseInt(tempTheme.spacing.md)}
              onChange={(e) => handleSpacingChange('md', parseInt(e.target.value))}
            />
          </SliderContainer>

          <SliderContainer style={{ marginTop: '1rem' }}>
            <Label>Espaçamento Grande: {tempTheme.spacing.lg}</Label>
            <Slider
              type="range"
              min="16"
              max="64"
              value={parseInt(tempTheme.spacing.lg)}
              onChange={(e) => handleSpacingChange('lg', parseInt(e.target.value))}
            />
          </SliderContainer>

          <ToggleContainer>
            <Label>Sombras Habilitadas</Label>
            <Toggle>
              <ToggleSlider
                type="checkbox"
                checked={tempTheme.shadows.enabled}
                onChange={(e) => handleShadowToggle(e.target.checked)}
              />
              <ToggleSpan />
            </Toggle>
          </ToggleContainer>
        </ConfigSection>

        {/* Preview */}
        <PreviewSection>
          <SectionTitle>👁️ Pré-visualização</SectionTitle>
          <PreviewGrid>
            <PreviewCard>
              <PreviewTitle>Card de Exemplo</PreviewTitle>
              <PreviewText>
                Este é um exemplo de como os cards ficam com o tema atual.
              </PreviewText>
              <PreviewButton variant="primary">Botão Primário</PreviewButton>
            </PreviewCard>

            <PreviewCard>
              <PreviewTitle>Informações</PreviewTitle>
              <PreviewText>
                Texto secundário para demonstrar a hierarquia visual.
              </PreviewText>
              <PreviewButton>Botão Secundário</PreviewButton>
            </PreviewCard>

            <PreviewCard>
              <PreviewTitle>Status Card</PreviewTitle>
              <PreviewText>
                Demonstração de contraste e legibilidade do texto.
              </PreviewText>
              <PreviewButton variant="danger">Ação Crítica</PreviewButton>
            </PreviewCard>
          </PreviewGrid>
        </PreviewSection>
      </ConfigGrid>

      <ButtonGroup>
        <Button onClick={applyTheme} variant="primary">
          ✅ Aplicar Tema
        </Button>
        <Button onClick={resetToDefault}>
          🔄 Resetar para Padrão
        </Button>
        <Button onClick={() => setTempTheme(currentTheme)}>
          ↶ Desfazer Alterações
        </Button>
      </ButtonGroup>
    </Container>
  );
};

export default ThemeConfigurator;
