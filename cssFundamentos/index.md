---
title: Fundamentos CSS
---

# Cascading Style Sheets

Cascading Style Sheets (**CSS**) é uma linguagem de estilos, que ao ser incorporada ao HTML permite alterar a aparência
gráfica dos componentes da página. Atualmente o CSS está na versão 3, porém foi apresentada em 1994.

Podemos classificar os recursos da linguagem em diferentes módulos, cada qual com finalidade específica.

- Selectors
- Box Model
- Backgrounds
- Image Values and Replaced Content
- Text Effects
- 2D Transformations
- 3D Transformations
- Animations
- Multiple Column Layout
- User Interface

```html
<div style="position:relative;height:220px;margin-top:50px;">
  <div style="opacity:0.5;position:absolute;left:50px;top:-30px;width:300px;height:150px;background-color:#40B3DF"></div>
  <div class="w3-theme" style="opacity:0.3;position:absolute;left:120px;top:20px;width:100px;height:170px;"></div>
  <div style="margin-top:30px;width:360px;height:130px;padding:20px;border-radius:10px;border:10px solid #EE872A;font-size:120%;">
 <h1>CSS = Styles and Colors</h1>
 <div style="letter-spacing:12px;font-size:15px;position:relative;left:25px;top:10px;">Manipulate Text</div>
 <div style="color:#40B3DF;letter-spacing:12px;font-size:15px;position:relative;left:25px;top:20px;">Colors,
 <span style="background-color:#B4009E;color:#ffffff;">&nbsp;Boxes</span></div>
 </div>
</div>
```


<figure markdown="span">
    <div style="position:relative;height:220px;margin-top:50px;">
    <div style="opacity:0.5;position:absolute;left:50px;top:-30px;width:300px;height:150px;background-color:#40B3DF"></div>
    <div class="w3-theme" style="opacity:0.3;position:absolute;left:120px;top:20px;width:100px;height:170px;"></div>
    <div style="margin-top:30px;width:360px;height:130px;padding:20px;border-radius:10px;border:10px solid #EE872A;font-size:120%;">
        <h1>CSS = Styles and Colors</h1>
        <div style="letter-spacing:12px;font-size:15px;position:relative;left:25px;top:10px;">Manipulate Text</div>
        <div style="color:#40B3DF;letter-spacing:12px;font-size:15px;position:relative;left:25px;top:20px;">Colors,
        <span style="background-color:#B4009E;color:#ffffff;">&nbsp;Boxes</span>
        </div>
    </div>
    </div>
    <br/><br/>
</figure>

## Sintaxe

A linguagem CSS3 fornece, basicamente, um vasto conjunto de propriedades de estilo, funções e outras construções que
podemos utilizar para modificar algum aspecto da aparência dos elementos HTML5.

Uma propriedade de estilo é definida por um nome e um valor. Por exemplo, se desejamos justificar determinado texto,
podemos escrever o seguinte trecho de código:

<pre class="pre">
  seletor
  <span style="color:rgb(0, 76, 178)">┌─┴─┐</span>
    p {
        text-align: justify;
        <span style="color:rgb(178, 111, 0)">└────┬────┘</span> <span style="color:rgb(0, 76, 178)">└──┬──┘</span>
        <span style="color:rgb(178, 111, 0)">propriedade</span>  <span style="color:rgb(0, 76, 178)">valor</span>
    }
</pre>

A propriedade chama-se text-align e seu valor foi configurado para justify, o qual indica que o texto deve ser
justificado. Ao final, é necessário colocar `;`. Um mesmo elemento pode receber diversas configurações de estilo
através do uso de diferentes propriedades.

O seletor indica em qual ou quais elementos esse estilo deve ser aplicado.

## Incorporar

A incorporação de código CSS3 a documentos HTML5 pode ser realizada de três formas distintas:
- arquivo externo
- elemento`<style>`
- atributo style (inline)

### Inline

Estilos inline são aqueles que acompanham o elemento, sendo definidos no atributo style. Devem ser utilizados com
cautela, pois são difíceis de alterar quando aparecem em grande quantidade no documento. É o caso do elemento `h1`
do documento apresentado na sequência. Perceba que o estilo se aplica somente ao elemento.

```html {all|4|all}
<!DOCTYPE html>
<html>
    <body>
        <h1 style="color:blue;text-align:center;">Titulo</h1>
    </body>
</html>
```

### Elemento Style

Quando utilizamos o elemento `<style>` temos maior flexibilidade na aplicação dos estilos, diferentemente do modo
inline, podemos aplicar o mesmo estilo a vários elementos do documento por meio de regras. O elemento `<style>` deve
ser adicionado dentro de `<head>` e todas as regras de estilo devem ser escritas como conteúdo do elemento.

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Minha primeira página Web</title>
    <style>
      body {
        background-color: rgb(159, 169, 170);
      }
      h1, h2, h3, h4, h5, h6 {
        color: black;
        text-transform: uppercase;
      }
    </style>
  </head>
</html>
```

### Arquivo Externo

A terceira forma, em que utilizamos a vinculação de um arquivo com regras de estilo ao documento é a mais utilizada.
Isso porque, quando pensamos em um site, devemos considerar a existência de muitos documentos e, todos eles
compartilhamento da mesma apresentação. Logo, ao deixarmos as regras de estilo em um único local, podemos facilmente
compartilhá-las em todos os documentos sem a necessidade de repetir código.

Para realizar a vinculação de um arquivo CSS ao documento devemos utilizar a tag `<link>`, que também deve estar
na `<head>`.

```html {all|6|all}
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf8" />
    <title>Minha primeira página Web</title>
    <link href="estilos.css" rel="stylesheet"/>
  </head>
</html>
```

<style scoped src="./shared.css"></style>
