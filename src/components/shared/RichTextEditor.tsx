import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Image as ImageIcon, 
  Video, 
  Link as LinkIcon,
  Code,
  Heading1,
  Heading2,
  Quote
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Nhập nội dung...",
  className,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [imageCaption, setImageCaption] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const { toast } = useToast();

  const insertText = useCallback((before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);

    onChange(newText);

    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }, [value, onChange]);

  const handleBold = () => insertText("**", "**");
  const handleItalic = () => insertText("*", "*");
  const handleCode = () => insertText("`", "`");
  
  const handleHeading1 = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    // Find start of current line
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const lineEnd = value.indexOf('\n', end);
    const actualEnd = lineEnd === -1 ? value.length : lineEnd;
    
    const lineText = value.substring(lineStart, actualEnd);
    const newLine = `# ${selectedText || lineText}`;
    const newText = value.substring(0, lineStart) + newLine + value.substring(actualEnd);
    
    onChange(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(lineStart + 2, lineStart + 2 + (selectedText || lineText).length);
    }, 0);
  };
  
  const handleHeading2 = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const lineEnd = value.indexOf('\n', end);
    const actualEnd = lineEnd === -1 ? value.length : lineEnd;
    
    const lineText = value.substring(lineStart, actualEnd);
    const newLine = `## ${selectedText || lineText}`;
    const newText = value.substring(0, lineStart) + newLine + value.substring(actualEnd);
    
    onChange(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(lineStart + 3, lineStart + 3 + (selectedText || lineText).length);
    }, 0);
  };
  
  const handleUnorderedList = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    if (selectedText.includes('\n')) {
      // Multiple lines selected
      const lines = selectedText.split('\n');
      const listText = lines.map(line => line.trim() ? `- ${line}` : line).join('\n');
      const newText = value.substring(0, start) + listText + value.substring(end);
      onChange(newText);
    } else {
      // Single line
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const lineEnd = value.indexOf('\n', end);
      const actualEnd = lineEnd === -1 ? value.length : lineEnd;
      const lineText = value.substring(lineStart, actualEnd);
      const newLine = `- ${selectedText || lineText}`;
      const newText = value.substring(0, lineStart) + newLine + value.substring(actualEnd);
      onChange(newText);
    }
    setTimeout(() => textarea.focus(), 0);
  };
  
  const handleOrderedList = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    if (selectedText.includes('\n')) {
      const lines = selectedText.split('\n');
      const listText = lines.map((line, i) => line.trim() ? `${i + 1}. ${line}` : line).join('\n');
      const newText = value.substring(0, start) + listText + value.substring(end);
      onChange(newText);
    } else {
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const lineEnd = value.indexOf('\n', end);
      const actualEnd = lineEnd === -1 ? value.length : lineEnd;
      const lineText = value.substring(lineStart, actualEnd);
      const newLine = `1. ${selectedText || lineText}`;
      const newText = value.substring(0, lineStart) + newLine + value.substring(actualEnd);
      onChange(newText);
    }
    setTimeout(() => textarea.focus(), 0);
  };
  
  const handleQuote = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    if (selectedText.includes('\n')) {
      const lines = selectedText.split('\n');
      const quoteText = lines.map(line => line.trim() ? `> ${line}` : line).join('\n');
      const newText = value.substring(0, start) + quoteText + value.substring(end);
      onChange(newText);
    } else {
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const lineEnd = value.indexOf('\n', end);
      const actualEnd = lineEnd === -1 ? value.length : lineEnd;
      const lineText = value.substring(lineStart, actualEnd);
      const newLine = `> ${selectedText || lineText}`;
      const newText = value.substring(0, lineStart) + newLine + value.substring(actualEnd);
      onChange(newText);
    }
    setTimeout(() => textarea.focus(), 0);
  };

  const handleInsertImage = () => {
    if (!imageUrl) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng nhập URL ảnh",
      });
      return;
    }

    const altText = imageAlt || "image";
    let imageMarkdown = `\n![${altText}](${imageUrl})`;
    
    // Add caption if provided
    if (imageCaption) {
      imageMarkdown += `\n*${imageCaption}*`;
    }
    imageMarkdown += `\n`;
    
    insertText(imageMarkdown);
    
    setIsImageDialogOpen(false);
    setImageUrl("");
    setImageAlt("");
    setImageCaption("");
  };

  const handleInsertVideo = () => {
    if (!videoUrl) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng nhập URL video",
      });
      return;
    }

    let embedCode = "";

    // Check if it's a YouTube URL
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = videoUrl.match(youtubeRegex);

    if (youtubeMatch) {
      const videoId = youtubeMatch[1];
      embedCode = `\n<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>\n`;
    } 
    // Check if it's a Vimeo URL
    else if (videoUrl.includes("vimeo.com")) {
      const vimeoRegex = /vimeo\.com\/(\d+)/;
      const vimeoMatch = videoUrl.match(vimeoRegex);
      if (vimeoMatch) {
        const videoId = vimeoMatch[1];
        embedCode = `\n<iframe src="https://player.vimeo.com/video/${videoId}" width="560" height="315" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>\n`;
      }
    }
    // Direct video URL (mp4, webm, etc.)
    else if (videoUrl.match(/\.(mp4|webm|ogg)$/i)) {
      embedCode = `\n<video width="560" height="315" controls>\n  <source src="${videoUrl}" type="video/mp4">\n  Your browser does not support the video tag.\n</video>\n`;
    }
    else {
      embedCode = `\n[Video: ${videoUrl}](${videoUrl})\n`;
    }

    insertText(embedCode);
    setIsVideoDialogOpen(false);
    setVideoUrl("");
  };

  const handleInsertLink = () => {
    if (!linkUrl) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng nhập URL",
      });
      return;
    }

    const text = linkText || linkUrl;
    const linkMarkdown = `[${text}](${linkUrl})`;
    insertText(linkMarkdown);
    
    setIsLinkDialogOpen(false);
    setLinkUrl("");
    setLinkText("");
  };

  return (
    <div className={className}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border rounded-t-md bg-muted/50">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleHeading1}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleHeading2}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <div className="w-px h-8 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleBold}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleItalic}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCode}
          title="Code"
        >
          <Code className="h-4 w-4" />
        </Button>
        <div className="w-px h-8 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleUnorderedList}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleOrderedList}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleQuote}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <div className="w-px h-8 bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsImageDialogOpen(true)}
          title="Insert Image"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsVideoDialogOpen(true)}
          title="Insert Video"
        >
          <Video className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setIsLinkDialogOpen(true)}
          title="Insert Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[400px] rounded-t-none font-mono text-sm"
      />

      {/* Image Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chèn ảnh</DialogTitle>
            <DialogDescription>
              Nhập URL của ảnh bạn muốn chèn vào bài viết
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="imageUrl">URL ảnh *</Label>
              <Input
                id="imageUrl"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="imageAlt">Mô tả ảnh (Alt text)</Label>
              <Input
                id="imageAlt"
                placeholder="Mô tả ngắn gọn về ảnh"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="imageCaption">Chú thích ảnh (Caption)</Label>
              <Input
                id="imageCaption"
                placeholder="Chú thích hiển thị dưới ảnh"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Chú thích sẽ hiển thị ngay dưới ảnh
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImageDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleInsertImage}>Chèn ảnh</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Video Dialog */}
      <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chèn video</DialogTitle>
            <DialogDescription>
              Nhập URL YouTube, Vimeo hoặc link video trực tiếp (.mp4, .webm)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="videoUrl">URL video *</Label>
              <Input
                id="videoUrl"
                placeholder="https://youtube.com/watch?v=... hoặc https://example.com/video.mp4"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Hỗ trợ: YouTube, Vimeo, MP4, WebM, OGG
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsVideoDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleInsertVideo}>Chèn video</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link Dialog */}
      <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chèn liên kết</DialogTitle>
            <DialogDescription>
              Tạo một liên kết trong bài viết
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="linkUrl">URL *</Label>
              <Input
                id="linkUrl"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="linkText">Văn bản hiển thị</Label>
              <Input
                id="linkText"
                placeholder="Nhấn vào đây"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLinkDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleInsertLink}>Chèn liên kết</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
