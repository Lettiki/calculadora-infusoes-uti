# Calculadora de Infusões UTI

Site que reproduz a planilha "CALCULADORA DE INFUSÕES - UTI 2026" (base: Andressa Souza) para cálculo de infusões contínuas em medicina veterinária intensiva.

Site estático (HTML, CSS e JavaScript puro, sem build). Para usar localmente, abra `index.html` ou sirva a pasta com qualquer servidor estático.

## Conta

```
volume de fármaco = (peso × 60 se a dose for /min × dose ÷ concentração) × volume total ÷ taxa
volume de soro    = volume total − volume de fármaco
duração           = volume total ÷ taxa
```

## Estrutura

- `drugs.js`: tabela de fármacos (concentração, faixa usual, unidade) e a função `calcInfusion`. Para incluir um fármaco ou corrigir uma concentração, edite aqui.
- `app.js`: interface.
- `index.html`, `style.css`: página e estilo.

## Ideias para as próximas versões

- Cálculo de fluidoterapia e doses de anestesia
- Índice de massa muscular e escore corporal
- Instalar como app no celular (PWA)

Ferramenta de apoio ao cálculo, não substitui o julgamento clínico do médico veterinário.
