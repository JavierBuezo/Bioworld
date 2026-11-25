# BioWorld · Simulador docente interactivo de ecología

**Autor:** Javier Buezo Bravo · Universidad Pública de Navarra (UPNA) · 2026  
**Tipo:** recurso educativo digital universitario en español.

**[Abrir BioWorld en GitHub Pages](https://javierbuezo.github.io/Bioworld/)** · [Visor científico del alumnado](https://javierbuezo.github.io/Bioworld/visor.html) · [Repositorio de código](https://github.com/JavierBuezo/Bioworld)

## Descripción académica

BioWorld es un simulador de ecosistemas diseñado para actividades de Biología universitaria introductoria, en particular en titulaciones de orientación agronómica. Propone un mundo de hasta seis biomas en el que especies ficticias de herbívoros y carnívoros, definidas mediante rasgos funcionales, interactúan a lo largo de ciclos de simulación. Integra disponibilidad y regeneración de recursos, competencia, depredación, reproducción, mortalidad, dispersión y perturbaciones programables.

La herramienta facilita el aprendizaje activo basado en hipótesis y la discusión colectiva sobre las consecuencias ecológicas de las decisiones de diseño de especies. Incluye panel de dirección, gráficos de dinámica poblacional y riqueza, atlas ecológico, fichas de especies, redes tróficas, registro de extinciones y un visor separado para analizar los resultados.

## Objetivos pedagógicos

- Relacionar rasgos funcionales y compromisos ecológicos (trade-offs) con la supervivencia, reproducción y distribución de poblaciones.
- Interpretar relaciones tróficas, limitación de recursos y efectos de la competencia y la depredación.
- Explorar colonización, cambios de biodiversidad, perturbaciones, extinciones y respuestas a escenarios alternativos.
- Formular hipótesis, contrastarlas con simulaciones replicadas e interpretar críticamente series temporales y datos exportados.
- Promover el trabajo en equipos, la argumentación científica y la reflexión sobre las limitaciones de los modelos.

## Uso propuesto

1. Abrir la aplicación y crear un mundo, seleccionar los biomas y definir su configuración inicial.
2. Diseñar especies ficticias individualmente o por equipos, introducir sus rasgos mediante el formulario o importar fichas JSON. También se pueden generar especies aleatorias.
3. Formular predicciones sobre abundancia, distribución y persistencia de las especies.
4. Avanzar la simulación por turnos, consultar los paneles y comparar los efectos de las perturbaciones o de distintos parámetros.
5. Guardar la partida en JSON y exportar resultados para su análisis. El docente puede exportar una instantánea específica para el alumnado.
6. Abrir el visor científico e importar esa instantánea JSON; explorar las fichas, gráficos y registros de eventos, y descargar los datos CSV disponibles.

El simulador y la importación local del visor no requieren crear una cuenta. Los mundos se guardan en el navegador; se recomienda exportar copias de seguridad. La publicación opcional de instantáneas por el director utiliza un token de GitHub con permisos en un repositorio separado (BioWorld-Visor) y no es necesaria para simular ni analizar resultados locales. No se debe compartir el token ni publicar datos personales del alumnado. El visor de este repositorio permite importar JSON aunque no haya datos-publicados.json disponible.

## Alcance científico y didáctico

BioWorld es un modelo simplificado y exploratorio, no un ecosistema empíricamente calibrado ni un instrumento de predicción ambiental. Las especies y los parámetros de ejemplo son ficticios o didácticos. Los resultados dependen de los supuestos, condiciones iniciales y componente estocástico; se recomienda comparar escenarios y replicaciones antes de extraer conclusiones. Los objetivos y la secuencia de uso descritos son propuestas de aplicación docente, no evidencia de utilización efectiva por estudiantes.

## Estructura y ejecución

- `index.html`: simulador, motor ecológico y panel de dirección.
- `atlas.js`: implementación del atlas ecológico compartido.
- `visor.html`: visualización y análisis de instantáneas exportadas, sin controles de simulación.
- `tests/smoke.spec.js`: pruebas de aceptación en navegador.
- `tests/balance-study.spec.js`: pruebas de exploración del equilibrio del modelo.
- `.github/workflows/`: automatización de las pruebas.

El recurso es un sitio estático HTML/CSS/JavaScript. Para ejecutarlo localmente, clonar o descargar el repositorio, mantener los archivos juntos y abrir index.html en un navegador moderno; alternativamente, servir la raíz con:

```sh
python3 -m http.server 8000
```

Abrir http://localhost:8000/ y, para el visor, http://localhost:8000/visor.html. No se requiere instalar bibliotecas de ejecución externas para el uso local ordinario. Para desarrollo y validación se utilizan Node.js y Playwright (dependencia de pruebas externa, no relicenciada):

```sh
npm install --no-save @playwright/test@1.56.1
npx playwright install chromium
npx playwright test tests/smoke.spec.js --reporter=line
```

Consultar el historial de GitHub Actions para el estado real de las pruebas y los despliegues. Un despliegue correcto no equivale a una validación integral de todas las interacciones.

## Licencias y procedencia

- **Código fuente propio:** [MIT](LICENSE). Incluye el motor, algoritmos, implementación HTML/CSS/JavaScript y pruebas propios.
- **Contenidos educativos originales:** [CC BY 4.0](LICENSE-CONTENT). Incluye textos, ejemplos ficticios, explicaciones, escenarios didácticos y composiciones gráficas originales, incluso cuando están integrados en los archivos fuente.
- **Exclusiones:** dependencias y herramientas externas, fuentes del sistema, glifos emoji, marcas, cualquier material de derechos no confirmados, fichas y aportaciones de terceros y alumnado. Los datos de partidas y el repositorio separado BioWorld-Visor no se relicencian. No se han identificado archivos de imágenes externas independientes en el árbol actual del repositorio.
- Las licencias solo abarcan los derechos que corresponden al autor. La UPNA se identifica como afiliación, no como titular o entidad que avala el recurso.

## Citación recomendada

Buezo Bravo, J. (2026). *BioWorld: simulador docente interactivo de ecología* [Recurso educativo digital]. Universidad Pública de Navarra (afiliación). https://github.com/JavierBuezo/Bioworld

Aplicación: https://javierbuezo.github.io/Bioworld/

El año 2026 corresponde a la identificación y documentación del recurso; no acredita por sí mismo la fecha de primera publicación ni su uso efectivo por estudiantes. Para reproducir una versión concreta, citar además el identificador del commit consultado.
