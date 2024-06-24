# MarkdownPPTX

A tool for converting markdown to PPTX (PowerPoint).  
This software works with Pandoc and Marp for conversion.   

## Usage

### Select Markdown File
Specify an input Markdown file.

### Format (Select Markdown Type)
Select an input Markdown Format.

#### Supported formats include:
- CommonMark
- CommonMark with extensions
- GitHub-Flavored Markdown
- Pandoc's Markdown
- MultiMarkdown
- PHP Markdown Extra
- Original Markdown


Detailed information on each format can be found in [Pandoc - Pandoc User’s Guide](https://pandoc.org/MANUAL.html),  
This option is available only when "Output as Image Slide" (described below) is disabled.

### Output as a Image Slide (with Marp)
This option can output more better layout (than Pandoc output (Aboves)) as a Image embedded PPTX file.  
Therefore, files outputted with this option are difficult to edit.    
This option output is created by [Marp](https://marp.app/) that embedded in this software.     

*Microsoft Edge* or *Google Chrome* is required to "Output as a Image Slide" works correctly.   

### Select Marp Config File 
Specify a Marp config File.

It appear only when "Output as a Image Slide" is enabled.  

Marp config file must follow suitable format (JSON or YAML).  
Please see: 
 https://github.com/marp-team/marp-cli/blob/main/README.md#Options  

### Select Reference Slide
Specify a Reference Slide that useful to custom the layout of output PPTX file.  
According to Pandoc document, Specified Slide works as same as Slide Master in PowerPoint.  

Please see also https://pandoc.org/MANUAL.html#option--reference-doc

### Output Reference Slide Template
You can download a suitable initial template PPTX file to create Reference Slide (described above).  
This PPTX file is saved at `HOME/markdownpptx` directory.  
The directory is created automatically if the directory does not exist. 

### PPTX Output Directory
The resulting PPTX file outputted to `HOME/markdownpptx`.  
If the directory does not exists, it is created.

