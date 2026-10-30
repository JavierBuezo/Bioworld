# BioWorld — Simulador docente de ecología

Proyecto para una actividad de Biología de primero: hasta 30 especies diseñadas por equipos, seis biomas, producción primaria, especialización alimentaria, competencia, depredación, mortalidad, reproducción, dispersión y perturbaciones programables.

## Incorporar BioWorld v0.2

La aplicación HTML existente está en el archivo **BioWorld_v0.2.zip** del chat de desarrollo.

1. Descomprime el ZIP.
2. En este repositorio, pulsa **Add file → Upload files**.
3. Sube **BioWorld/index.html** a la **raíz** del repositorio (no a una carpeta BioWorld).
4. Pulsa **Commit changes**.

Hecho esto, podremos modificar la misma aplicación directamente desde la conexión de GitHub, sin descargar nuevas versiones.

## Publicación

Este repositorio está inicialmente **privado**. Si quieres publicar gratuitamente en GitHub Pages, cambia su visibilidad a pública en **Settings → General → Danger Zone**, y luego activa **Settings → Pages → Deploy from a branch → main → /(root)**.

La dirección esperada tras la publicación es: https://javierbuezo.github.io/Bioworld/

Evita publicar datos personales del alumnado en el código.

## Estado científico

BioWorld v0.2 es un prototipo de pruebas, no un ecosistema calibrado. Incluye formulario/importación de especies, perturbaciones, simulación por ciclos e historial básico. Hay que validar las tasas ecológicas con replicaciones y mejorar informes por especie y causa de mortalidad.

## Desarrollo

Se conservará el historial Git para comparar cambios y recuperar versiones. Exporta las partidas JSON antes de cambios importantes del motor.
