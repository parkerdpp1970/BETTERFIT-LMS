
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Plus, Layout as LayoutIcon, Type, Image as ImageIcon, Video, CheckSquare, 
    Search, X, Monitor, Smartphone, Tablet, FileText, ChevronDown, ChevronRight, 
    List, GripVertical, Trash2, Lock, Bold, Italic, Underline, 
    Link as LinkIcon, Sparkles, MoreHorizontal, AlignLeft, AlignCenter, 
    AlignRight, ListOrdered, Settings, Palette, Upload, Star, Layers, Info,
    Gamepad2, Wand2, ArrowLeftRight, Download, MousePointerClick, 
    MessageSquare, SplitSquareHorizontal, Quote, ScanLine, Users, Zap, Play, ArrowRight, AlertTriangle, Save,
    Globe, Figma, Instagram, Twitter, HardDrive, Database, Activity, Cloud, BarChart3, Box
} from 'lucide-react';

// Types for the hierarchy
interface TextStyle {
    size: 'Heading 1' | 'Heading 2' | 'Heading 3' | 'Heading 4' | 'Body Text' | 'Small';
    bold: boolean;
    italic: boolean;
    underline: boolean;
    align: 'left' | 'center' | 'right';
    listType: 'none' | 'bullet' | 'number';
}

interface Slide {
    id: string;
    type: string;
    title: string;
    titleStyle?: TextStyle;
    subheading: string;
    subheadingStyle?: TextStyle;
    subtitle: string;
    subtitleStyle?: TextStyle; // Body Text Style
    buttonText: string;
    buttonStyle?: TextStyle;   // Button Text Style
    formData: any | null; // Stores Activity specific data like videoUrl, instructions, prompt
    isLocked?: boolean;
}

interface Lesson {
    id: string;
    title: string;
    collapsed: boolean;
    slides: Slide[];
}

interface Section {
    id: string;
    title: string;
    collapsed: boolean;
    isDefault?: boolean; // Flag to hide header if it's the only one
    lessons: Lesson[];
}

// Drag Item Types
type DragItemType = 'SECTION' | 'LESSON' | 'SLIDE';

interface DragItem {
    type: DragItemType;
    id: string;
    sectionId?: string; // Only for lessons
    lessonId?: string;  // Only for slides
    index: number;
}

// Helper: Default Text Style
const defaultTitleStyle: TextStyle = { size: 'Heading 3', bold: true, italic: false, underline: false, align: 'center', listType: 'none' };
const defaultSubheadingStyle: TextStyle = { size: 'Body Text', bold: false, italic: false, underline: false, align: 'center', listType: 'none' };
const defaultBodyStyle: TextStyle = { size: 'Body Text', bold: false, italic: false, underline: false, align: 'left', listType: 'none' };
const defaultButtonStyle: TextStyle = { size: 'Body Text', bold: true, italic: false, underline: false, align: 'center', listType: 'none' };

// Slide Library Categories Data
const SLIDE_LIBRARY_CATEGORIES = [
    {
        title: 'TEACH',
        items: [
            { id: 'Text', label: 'Text', icon: Type },
            { id: 'Image', label: 'Image', icon: ImageIcon },
            { id: 'Video', label: 'Video', icon: Video },
        ]
    },
    {
        title: 'QUIZ',
        items: [
            { id: 'AI_Quiz', label: 'Create with AI', icon: Sparkles },
            { id: 'MCQ', label: 'Multiple choice', icon: CheckSquare },
            { id: 'Numbers', label: 'Numbers', icon: ListOrdered },
            { id: 'Words', label: 'Words', icon: Type },
            { id: 'Match', label: 'Match', icon: ArrowLeftRight },
        ]
    },
    {
        title: 'ENGAGE',
        items: [
            { id: 'Games', label: 'Games', icon: Gamepad2 },
            { id: 'Feedback', label: 'Feedback', icon: MessageSquare }, // Maps to Form
            { id: 'Peer', label: 'Discussion', icon: Users }, // Mock
        ]
    },
    {
        title: 'SUBMISSION',
        items: [
            { id: 'Activity', label: 'Activity', icon: MousePointerClick },
            { id: 'Assignment', label: 'Assignment', icon: FileText },
            { id: 'MCQ_Submission', label: 'Multiple choice', icon: CheckSquare },
            { id: 'PeerReview', label: 'Peer review', icon: Users },
        ]
    },
    {
        title: 'EMBED APPS & WEBPAGES',
        items: [
            { id: 'Webpage', label: 'Webpage or app', icon: Globe },
            { id: 'Gamma', label: 'Gamma embed', icon: Zap },
            { id: 'Upload_Embed', label: 'File upload', icon: Upload },
            { id: 'GDrive', label: 'Google Drive', icon: HardDrive },
            { id: 'Figma', label: 'Figma', icon: Figma },
            { id: 'Instagram', label: 'Instagram', icon: Instagram },
            { id: 'Tweet', label: 'Tweet', icon: Twitter },
            { id: 'Miro', label: 'Miro board', icon: Monitor },
            { id: 'Airtable', label: 'Airtable', icon: Database },
            { id: 'Amplitude', label: 'Amplitude', icon: Activity },
            { id: 'Office365', label: 'Office 365', icon: Box },
            { id: 'PowerBI', label: 'PowerBI', icon: BarChart3 },
        ]
    },
    {
        title: 'MORE',
        items: [
            { id: 'Advanced', label: 'Advanced', icon: Zap }, // Mock
            { id: 'Import', label: 'Import slide', icon: Download },
        ]
    }
];

// Mock Templates for the Grid View
const SLIDE_TEMPLATES: Record<string, { title: string; description: string; icon?: any; type: string }[]> = {
    'Text': [
        { title: 'Bulleted list', description: 'Show a list of bullet points', type: 'Text' },
        { title: 'Comparison', description: 'Compare two text blocks', icon: SplitSquareHorizontal, type: 'Text' },
        { title: 'Quote', description: 'Show a quotation', icon: Quote, type: 'Text' },
        { title: 'Scrolling text', description: 'Show long-form text', icon: ScanLine, type: 'Text' },
        { title: 'Standard Text', description: 'Title and body text', type: 'Text' }
    ],
    'Image': [
        { title: 'Full Image', description: 'Image with overlay text', type: 'Image' },
        { title: 'Image & Text', description: 'Split screen layout', type: 'Image' },
        { title: 'Gallery', description: 'Swipeable image gallery', type: 'Image' }
    ],
    'Video': [
        { title: 'Video Embed', description: 'YouTube or Vimeo', type: 'Video' },
        { title: 'Video & Text', description: 'Video with transcript area', type: 'Video' }
    ],
    'Feedback': [
        { title: 'Embed Form', description: 'Collect data or feedback', icon: FileText, type: 'Form' },
        { title: 'Survey', description: 'Simple satisfaction rating', icon: Star, type: 'Form' }
    ],
    'Activity': [
        { title: 'Video & Reflection', description: 'Watch a video then self-reflect', icon: MousePointerClick, type: 'Activity' },
    ],
    'Assignment': [
        { title: 'File Upload', description: 'Student uploads a document', icon: Upload, type: 'Assignment' },
        { title: 'Written Answer', description: 'Long form text response', icon: FileText, type: 'Assignment' }
    ],
    'MCQ_Submission': [
        { title: 'Single Answer', description: 'One correct option', icon: CheckSquare, type: 'Quiz' },
        { title: 'Multiple Select', description: 'Select all that apply', icon: CheckSquare, type: 'Quiz' }
    ],
    'PeerReview': [
        { title: 'Standard Peer Review', description: 'Students review each other\'s work', icon: Users, type: 'PeerReview' },
        { title: 'Rubric Based', description: 'Review based on specific criteria', icon: List, type: 'PeerReview' }
    ],
    'Webpage': [
        { title: 'Responsive Embed', description: 'Embed a web page or application', icon: Globe, type: 'Embed' }
    ],
    'Gamma': [
        { title: 'Gamma Presentation', description: 'Embed a Gamma presentation', icon: Zap, type: 'Embed' }
    ],
    'Upload_Embed': [
        { title: 'File Embed', description: 'Upload and display a file', icon: Upload, type: 'Embed' }
    ],
    'GDrive': [
        { title: 'Google Drive File', description: 'Embed from Google Drive', icon: HardDrive, type: 'Embed' }
    ],
    'Figma': [
        { title: 'Figma Design', description: 'Embed interactive figma designs', icon: Figma, type: 'Embed' }
    ],
    'Instagram': [
        { title: 'Instagram Post', description: 'Embed an Instagram post', icon: Instagram, type: 'Embed' }
    ],
    'Tweet': [
        { title: 'Tweet', description: 'Embed a specific Tweet', icon: Twitter, type: 'Embed' }
    ],
    'Miro': [
        { title: 'Miro Board', description: 'Embed a Miro board', icon: Monitor, type: 'Embed' }
    ],
    'Airtable': [
        { title: 'Airtable Base', description: 'Embed an Airtable base or view', icon: Database, type: 'Embed' }
    ],
    'Amplitude': [
        { title: 'Amplitude Chart', description: 'Embed Amplitude analytics', icon: Activity, type: 'Embed' }
    ],
    'Office365': [
        { title: 'Office 365 Doc', description: 'Embed Word, Excel or PPT', icon: Box, type: 'Embed' }
    ],
    'PowerBI': [
        { title: 'PowerBI Report', description: 'Embed PowerBI interactive reports', icon: BarChart3, type: 'Embed' }
    ]
};

// Fallback template list
const GENERIC_TEMPLATES: { title: string; description: string; icon?: any; type: string }[] = [
    { title: 'Default Layout', description: 'Standard layout for this type', type: 'Text' }
];

const CreatorCourseBuilder: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Data from previous step
  const initialData = location.state?.courseData || { title: 'Untitled Course', description: '' };

  const [courseTitle, setCourseTitle] = useState(initialData.title);
  const [courseLogo, setCourseLogo] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  
  // Layout State (Resizable Panels)
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(280);
  const [rightSidebarWidth, setRightSidebarWidth] = useState(300);

  // Navigation / Selection State
  const [activeLessonId, setActiveLessonId] = useState<string>('l1');
  const [activeSlideId, setActiveSlideId] = useState<string>('s1');
  
  // Editing State
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [editingSubtitle, setEditingSubtitle] = useState(false); // To toggle text area vs render
  
  // View State
  const [showStyleEditor, setShowStyleEditor] = useState(false);
  const [styleEditorSelection, setStyleEditorSelection] = useState<'course' | string>('course');
  
  const [showSlideLibrary, setShowSlideLibrary] = useState(false);
  const [selectedLibraryCategory, setSelectedLibraryCategory] = useState<string>('Text');
  const [insertSlideLocation, setInsertSlideLocation] = useState<{ lessonId: string, index: number } | null>(null);

  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('mobile');
  
  // Interaction State for Activity Slide Preview
  const [activityStep, setActivityStep] = useState<'intro' | 'reflection'>('intro');

  // Menu State
  const [showLessonMenu, setShowLessonMenu] = useState(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);

  // Drag State
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  // Active Style Editor State (Properties Panel)
  const [activeStyleField, setActiveStyleField] = useState<'title' | 'subheading' | 'subtitle' | 'button' | null>(null);
  
  // Toolbar State
  const [toolbarState, setToolbarState] = useState({ visible: false, x: 0, y: 0 });
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);

  // Course Structure: Section -> Lesson -> Slide
  const [sections, setSections] = useState<Section[]>([
      {
          id: 'sec1',
          title: 'Untitled Section',
          isDefault: true,
          collapsed: false,
          lessons: [
              { 
                  id: 'l1', 
                  title: 'Untitled Lesson', 
                  collapsed: false, 
                  slides: [
                      { 
                          id: 's1', 
                          type: 'Title', 
                          title: 'Title Slide', 
                          titleStyle: defaultTitleStyle, 
                          subheading: 'Welcome to the Course',
                          subheadingStyle: defaultSubheadingStyle,
                          subtitle: '', 
                          subtitleStyle: defaultBodyStyle,
                          buttonText: 'Continue',
                          buttonStyle: defaultButtonStyle,
                          formData: null 
                      },
                      {
                          id: 'sEnd1',
                          type: 'End',
                          title: 'All done!',
                          titleStyle: defaultTitleStyle, 
                          subheading: 'Another lesson conquered. Keep going!',
                          subheadingStyle: defaultSubheadingStyle,
                          subtitle: '',
                          subtitleStyle: defaultBodyStyle,
                          buttonText: 'Finish',
                          buttonStyle: defaultButtonStyle,
                          formData: null,
                          isLocked: true
                      }
                  ] 
              }
          ]
      }
  ]);

  // Derived state for current selection
  const currentSection = sections.find(s => s.lessons.some(l => l.id === activeLessonId));
  const currentLesson = currentSection?.lessons.find(l => l.id === activeLessonId);
  const currentSlideData = currentLesson?.slides.find(s => s.id === activeSlideId);

  useEffect(() => {
      // Ensure we have a valid selection if data changes (e.g. after deletion)
      if (!currentLesson && sections.length > 0) {
          const firstSection = sections[0];
          if (firstSection.lessons.length > 0) {
              const firstLesson = firstSection.lessons[0];
              setActiveLessonId(firstLesson.id);
              if (firstLesson.slides.length > 0) {
                  setActiveSlideId(firstLesson.slides[0].id);
              }
          }
      }
  }, [sections]);

  // Reset activity state when slide changes
  useEffect(() => {
      setActivityStep('intro');
  }, [activeSlideId]);

  // --- ACTIONS ---

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setCourseLogo(reader.result as string);
          };
          reader.readAsDataURL(file);
      }
  };

  const handleSave = () => {
      // In a real app, save to backend
      navigate('/creator-dashboard');
  };

  const handleAddSection = () => {
      const newSection: Section = {
          id: `sec${Date.now()}`,
          title: 'Untitled Section',
          collapsed: false,
          lessons: []
      };
      setSections([...sections, newSection]);
      setShowLessonMenu(false);
  };

  const createDefaultSlides = (): Slide[] => {
      const titleSlideId = `s${Date.now()}`;
      const endSlideId = `sEnd${Date.now()}`;
      return [
          { 
              id: titleSlideId, 
              type: 'Title', 
              title: 'Title Slide', 
              titleStyle: defaultTitleStyle, 
              subheading: '',
              subheadingStyle: defaultSubheadingStyle,
              subtitle: '', 
              subtitleStyle: defaultBodyStyle,
              buttonText: 'Continue',
              buttonStyle: defaultButtonStyle,
              formData: null 
          },
          {
              id: endSlideId,
              type: 'End',
              title: 'All done!',
              titleStyle: defaultTitleStyle, 
              subheading: 'Another lesson conquered. Keep going!',
              subheadingStyle: defaultSubheadingStyle,
              subtitle: '',
              subtitleStyle: defaultBodyStyle,
              buttonText: 'Finish',
              buttonStyle: defaultButtonStyle,
              formData: null,
              isLocked: true
          }
      ];
  };

  const handleAddLessonToSection = (sectionId: string) => {
      const newLessonId = `l${Date.now()}`;
      const defaultSlides = createDefaultSlides();
      
      const newLesson: Lesson = {
          id: newLessonId,
          title: 'Untitled Lesson',
          collapsed: false,
          slides: defaultSlides
      };

      setSections(prev => prev.map(s => {
          if (s.id === sectionId) {
              return { ...s, lessons: [...s.lessons, newLesson] };
          }
          return s;
      }));

      setActiveLessonId(newLessonId);
      setActiveSlideId(defaultSlides[0].id);
  };

  const handleAddLesson = () => {
      if (sections.length === 0) {
          const newSection: Section = {
              id: `sec${Date.now()}`,
              title: 'Untitled Section',
              collapsed: false,
              lessons: []
          };
          setSections([newSection]);
          const defaultSlides = createDefaultSlides();
          const newLesson: Lesson = {
              id: `l${Date.now()}`,
              title: 'Untitled Lesson',
              collapsed: false,
              slides: defaultSlides
          };
          setSections([{...newSection, lessons: [newLesson]}]);
          setActiveLessonId(newLesson.id);
          setActiveSlideId(defaultSlides[0].id);
          setShowLessonMenu(false);
          return;
      }

      const targetSectionId = currentSection ? currentSection.id : sections[0].id;
      handleAddLessonToSection(targetSectionId);
      setShowLessonMenu(false);
  };

  const handleAddSlideAppend = () => {
      if (!currentLesson) return;
      setInsertSlideLocation(null); 
      setShowSlideLibrary(true);
  };

  const handleAddSlideAt = (lessonId: string, index: number) => {
      setActiveLessonId(lessonId);
      setInsertSlideLocation({ lessonId, index });
      setShowSlideLibrary(true);
  };

  const handleSelectSlideType = (type: string, title?: string) => {
      if (!currentLesson && !insertSlideLocation) return;

      const targetLessonId = insertSlideLocation ? insertSlideLocation.lessonId : activeLessonId;

      const defaultFormData = type === 'Activity' ? { 
          videoUrl: '', 
          instructions: 'Watch the exercise overview, then use the Empathy Map resource to draft your first persona.',
          prompt: 'What was the most challenging part of defining the user frustrations?',
          buttonText: 'Start Reflection' 
      } : type === 'Form' ? { formId: '' } : type === 'Embed' ? { url: '', embedType: 'Webpage' } : null;

      const newSlide: Slide = { 
          id: `s${Date.now()}`, 
          type: type, 
          title: title || type, 
          titleStyle: defaultTitleStyle, 
          subheading: '',
          subheadingStyle: defaultSubheadingStyle,
          subtitle: type === 'Form' ? 'Please complete the form below' : 'Content goes here',
          subtitleStyle: defaultBodyStyle,
          buttonText: type === 'Activity' ? 'Start Reflection' : 'Continue',
          buttonStyle: defaultButtonStyle,
          formData: defaultFormData
      };
      
      setSections(prev => prev.map(s => ({
          ...s,
          lessons: s.lessons.map(l => {
              if (l.id === targetLessonId) {
                  const newSlides = [...l.slides];
                  if (insertSlideLocation) {
                      newSlides.splice(insertSlideLocation.index, 0, newSlide);
                  } else {
                      const lastSlide = newSlides[newSlides.length - 1];
                      if (lastSlide && lastSlide.isLocked) {
                          newSlides.splice(newSlides.length - 1, 0, newSlide);
                      } else {
                          newSlides.push(newSlide);
                      }
                  }
                  return { ...l, slides: newSlides };
              }
              return l;
          })
      })));
      
      setActiveLessonId(targetLessonId);
      setActiveSlideId(newSlide.id);
      setShowSlideLibrary(false);
      setInsertSlideLocation(null);
  };

  // --- RESIZE HANDLERS ---

  const startResizingLeft = (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startWidth = leftSidebarWidth;

      const doDrag = (dragEvent: MouseEvent) => {
          const newWidth = Math.max(200, Math.min(600, startWidth + (dragEvent.clientX - startX)));
          setLeftSidebarWidth(newWidth);
      };

      const stopDrag = () => {
          document.removeEventListener('mousemove', doDrag);
          document.removeEventListener('mouseup', stopDrag);
          document.body.style.cursor = 'default';
      };

      document.body.style.cursor = 'col-resize';
      document.addEventListener('mousemove', doDrag);
      document.addEventListener('mouseup', stopDrag);
  };

  const startResizingRight = (e: React.MouseEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startWidth = rightSidebarWidth;

      const doDrag = (dragEvent: MouseEvent) => {
          const newWidth = Math.max(200, Math.min(600, startWidth - (dragEvent.clientX - startX)));
          setRightSidebarWidth(newWidth);
      };

      const stopDrag = () => {
          document.removeEventListener('mousemove', doDrag);
          document.removeEventListener('mouseup', stopDrag);
          document.body.style.cursor = 'default';
      };

      document.body.style.cursor = 'col-resize';
      document.addEventListener('mousemove', doDrag);
      document.addEventListener('mouseup', stopDrag);
  };

  // --- DRAG AND DROP HANDLERS ---

  const handleDragStart = (e: React.DragEvent, item: DragItem) => {
      e.stopPropagation();
      
      if (item.type === 'SLIDE') {
          const section = sections.find(s => s.lessons.some(l => l.id === item.lessonId));
          const lesson = section?.lessons.find(l => l.id === item.lessonId);
          const slide = lesson?.slides.find(s => s.id === item.id);
          if (slide?.isLocked) {
              e.preventDefault();
              return;
          }
      }

      setDraggedItem(item);
      e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOverId(id);
  };

  const handleDropSection = (e: React.DragEvent, targetSectionIndex: number) => {
      e.preventDefault();
      e.stopPropagation();
      
      if (!draggedItem || draggedItem.type !== 'SECTION') {
          setDragOverId(null);
          return;
      }

      const sourceIndex = draggedItem.index;
      if (sections[sourceIndex].isDefault) {
          setDragOverId(null);
          return;
      }
      if (sections[0].isDefault && targetSectionIndex === 0) {
          targetSectionIndex = 1;
      }
      if (sourceIndex === targetSectionIndex) {
          setDragOverId(null);
          return;
      }

      const newSections = [...sections];
      const [movedSection] = newSections.splice(sourceIndex, 1);
      newSections.splice(targetSectionIndex, 0, movedSection);
      setSections(newSections);
      setDragOverId(null);
      setDraggedItem(null);
  };

  const handleDropLesson = (e: React.DragEvent, targetSectionId: string, targetLessonIndex: number) => {
      e.preventDefault();
      e.stopPropagation();

      if (!draggedItem || draggedItem.type !== 'LESSON') {
          setDragOverId(null);
          return;
      }

      const sourceSectionId = draggedItem.sectionId;
      const sourceLessonId = draggedItem.id;
      
      const newSections = [...sections]; // Shallow copy of array
      
      // Find indices
      const sourceSecIdx = newSections.findIndex((s: Section) => s.id === sourceSectionId);
      if (sourceSecIdx === -1) { setDragOverId(null); return; }
      
      // Clone source section to mutate
      const sourceSection = { ...newSections[sourceSecIdx], lessons: [...newSections[sourceSecIdx].lessons] };
      newSections[sourceSecIdx] = sourceSection;

      const sourceLessonIdx = sourceSection.lessons.findIndex((l: Lesson) => l.id === sourceLessonId);
      if (sourceLessonIdx === -1) { setDragOverId(null); return; }

      // Remove from source
      const [movedLesson] = sourceSection.lessons.splice(sourceLessonIdx, 1);

      // Find target section
      const targetSecIdx = newSections.findIndex((s: Section) => s.id === targetSectionId);
      if (targetSecIdx === -1) { setDragOverId(null); return; }
      
      // Clone target section to mutate (re-fetch if same as source to get updated lessons)
      const targetSection = { ...newSections[targetSecIdx], lessons: [...newSections[targetSecIdx].lessons] };
      
      if (targetLessonIndex === -1) {
          // Dropped on Section Header -> Push to end
          targetSection.lessons.push(movedLesson);
      } else {
          // Dropped on a Lesson -> Insert at index
          // Note: Since we removed the item first, indices shift. 
          // If in same section, dragging down usually means we want to insert AFTER the item we dropped on, 
          // which effectively corresponds to `targetLessonIndex` in the array that has the item removed.
          targetSection.lessons.splice(targetLessonIndex, 0, movedLesson);
      }
      
      newSections[targetSecIdx] = targetSection;

      setSections(newSections);
      setDragOverId(null);
      setDraggedItem(null);
  };

  const handleDropSlide = (e: React.DragEvent, targetLessonId: string, targetSlideIndex: number) => {
      e.preventDefault();
      e.stopPropagation();

      if (!draggedItem || draggedItem.type !== 'SLIDE') {
          setDragOverId(null);
          return;
      }

      const sourceLessonId = draggedItem.lessonId;
      const sourceSlideId = draggedItem.id;
      const newSections = JSON.parse(JSON.stringify(sections));

      let movedSlide: Slide | null = null;

      for (const sec of newSections) {
          const lesson = sec.lessons.find((l: Lesson) => l.id === sourceLessonId);
          if (lesson) {
              const slideIdx = lesson.slides.findIndex((s: Slide) => s.id === sourceSlideId);
              if (slideIdx !== -1) {
                  movedSlide = lesson.slides[slideIdx];
                  lesson.slides.splice(slideIdx, 1);
                  break;
              }
          }
      }

      if (!movedSlide) {
          setDragOverId(null);
          return;
      }

      for (const sec of newSections) {
          const lesson = sec.lessons.find((l: Lesson) => l.id === targetLessonId);
          if (lesson) {
              if (targetSlideIndex === -1) {
                  const last = lesson.slides[lesson.slides.length - 1];
                  if (last && last.isLocked) {
                      lesson.slides.splice(lesson.slides.length - 1, 0, movedSlide);
                  } else {
                      lesson.slides.push(movedSlide);
                  }
              } else {
                  lesson.slides.splice(targetSlideIndex, 0, movedSlide);
                  const lockedIdx = lesson.slides.findIndex((s: Slide) => s.isLocked);
                  if (lockedIdx !== -1 && lockedIdx !== lesson.slides.length - 1) {
                      const [lockedSlide] = lesson.slides.splice(lockedIdx, 1);
                      lesson.slides.push(lockedSlide);
                  }
              }
              break;
          }
      }

      setSections(newSections);
      setDragOverId(null);
      setDraggedItem(null);
      setActiveLessonId(targetLessonId);
  };

  const toggleSectionCollapse = (sectionId: string) => {
      setSections(prev => prev.map(s => s.id === sectionId ? { ...s, collapsed: !s.collapsed } : s));
  };

  const toggleLessonCollapse = (lessonId: string) => {
      setSections(prev => prev.map(s => ({
          ...s,
          lessons: s.lessons.map(l => l.id === lessonId ? { ...l, collapsed: !l.collapsed } : l)
      })));
  };

  // --- UPDATERS ---

  const updateSectionTitle = (id: string, newTitle: string) => {
      setSections(prev => prev.map(s => s.id === id ? { ...s, title: newTitle } : s));
  };

  const updateLessonTitle = (lessonId: string, newTitle: string) => {
      setSections(prev => prev.map(s => ({
          ...s,
          lessons: s.lessons.map(l => l.id === lessonId ? { ...l, title: newTitle } : l)
      })));
  };

  const updateSlideField = (field: string, value: any) => {
      setSections(prev => prev.map(s => ({
          ...s,
          lessons: s.lessons.map(l => {
              if (l.id === activeLessonId) {
                  return {
                      ...l,
                      slides: l.slides.map(slide => 
                          slide.id === activeSlideId ? { ...slide, [field]: value } : slide
                      )
                  };
              }
              return l;
          })
      })));
  };

  const updateSlideStyle = (field: 'titleStyle' | 'subheadingStyle' | 'subtitleStyle' | 'buttonStyle', styleUpdate: Partial<TextStyle>) => {
      if (!currentSlideData) return;
      const currentStyle = currentSlideData[field] || 
          (field === 'titleStyle' ? defaultTitleStyle : 
           field === 'subheadingStyle' ? defaultSubheadingStyle : 
           field === 'buttonStyle' ? defaultButtonStyle :
           defaultBodyStyle);
      
      const newStyle = { ...currentStyle, ...styleUpdate };
      updateSlideField(field, newStyle);
  };

  const updateFormData = (key: string, value: string) => {
      if (!currentSlideData) return;
      const updatedFormData = { ...currentSlideData.formData, [key]: value };
      updateSlideField('formData', updatedFormData);
  };

  const deleteSlide = (e: React.MouseEvent, slideId: string) => {
      e.stopPropagation();
      if (!currentLesson) return;
      const slide = currentLesson.slides.find(s => s.id === slideId);
      if (slide?.isLocked) return;

      if (currentLesson.slides.length <= 1) return;

      setSections(prev => prev.map(s => ({
          ...s,
          lessons: s.lessons.map(l => {
              if (l.id === activeLessonId) {
                  return { ...l, slides: l.slides.filter(slide => slide.id !== slideId) };
              }
              return l;
          })
      })));

      if (slideId === activeSlideId) {
          if (currentLesson.slides.length > 0) {
              setActiveSlideId(currentLesson.slides[0].id);
          }
      }
  };

  // Get current style for the active field
  const getCurrentStyle = (fieldName?: 'title' | 'subheading' | 'subtitle' | 'button'): TextStyle => {
      const field = fieldName || activeStyleField;
      if (!currentSlideData || !field) return defaultTitleStyle;
      
      if (field === 'title') return currentSlideData.titleStyle || defaultTitleStyle;
      if (field === 'subheading') return currentSlideData.subheadingStyle || defaultSubheadingStyle;
      if (field === 'subtitle') return currentSlideData.subtitleStyle || defaultBodyStyle;
      if (field === 'button') return currentSlideData.buttonStyle || defaultButtonStyle;
      
      return defaultTitleStyle;
  };

  // Render CSS class based on style object
  const getStyleClass = (style?: TextStyle) => {
      if (!style) return '';
      let classes = '';
      
      // Size Mapping based on user request (Heading 1-4, Body Text, Small)
      switch(style.size) {
          case 'Heading 1': classes += ' text-6xl'; break;
          case 'Heading 2': classes += ' text-5xl'; break;
          case 'Heading 3': classes += ' text-4xl'; break;
          case 'Heading 4': classes += ' text-2xl'; break;
          case 'Body Text': classes += ' text-lg'; break;
          case 'Small': classes += ' text-xs'; break;
          default: classes += ' text-lg';
      }

      // Formatting
      if (style.bold) classes += ' font-extrabold'; else classes += ' font-normal';
      if (style.italic) classes += ' italic';
      if (style.underline) classes += ' underline';
      
      // Alignment
      if (style.align === 'left') classes += ' text-left';
      else if (style.align === 'right') classes += ' text-right';
      else classes += ' text-center';

      return classes;
  };

  // Render Body Content (handling lists)
  const renderBodyContent = (text: string, style?: TextStyle) => {
      const safeStyle = style || defaultBodyStyle;
      const baseClass = getStyleClass(safeStyle);
      
      if (safeStyle.listType === 'bullet') {
          return (
              <ul className={`list-disc list-inside ${baseClass} w-full`}>
                  {text.split('\n').filter(t => t.trim()).map((line, i) => (
                      <li key={i}>{line}</li>
                  ))}
              </ul>
          );
      }
      
      if (safeStyle.listType === 'number') {
          return (
              <ol className={`list-decimal list-inside ${baseClass} w-full`}>
                  {text.split('\n').filter(t => t.trim()).map((line, i) => (
                      <li key={i}>{line}</li>
                  ))}
              </ol>
          );
      }

      return <div className={`${baseClass} w-full whitespace-pre-wrap`}>{text}</div>;
  };

  // --- NEW HANDLERS FOR TOOLBAR ---
  const handleMouseUp = (e: React.MouseEvent, field: 'title' | 'subheading' | 'subtitle' | 'button') => {
      e.stopPropagation();
      setActiveStyleField(field);
      // Logic to show toolbar near the element
      setToolbarState({
          visible: true,
          x: e.clientX,
          y: e.clientY - 60 
      });
  };

  const applyStyle = (property: keyof TextStyle, value: any) => {
      const fieldMap: Record<string, 'titleStyle' | 'subheadingStyle' | 'subtitleStyle' | 'buttonStyle'> = {
          'title': 'titleStyle',
          'subheading': 'subheadingStyle',
          'subtitle': 'subtitleStyle',
          'button': 'buttonStyle'
      };
      
      if (activeStyleField && fieldMap[activeStyleField]) {
          updateSlideStyle(fieldMap[activeStyleField], { [property]: value });
      }
  };

  // Style Popup Component
  const StylePopup = ({ field }: { field: 'title' | 'subheading' | 'subtitle' | 'button' }) => {
      const style = getCurrentStyle(field);
      const styleField = field === 'title' ? 'titleStyle' 
                       : field === 'subheading' ? 'subheadingStyle'
                       : field === 'subtitle' ? 'subtitleStyle'
                       : 'buttonStyle';

      const updateStyle = (key: keyof TextStyle, value: any) => {
          updateSlideStyle(styleField, { [key]: value });
      };

      return (
          <div 
            className="absolute top-8 right-0 z-50 bg-[#1e1e1e] border border-[#333] rounded-lg shadow-xl p-2 w-64 animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()} // Stop click from closing the panel
          >
              {/* Row 1: Size - Updated options */}
              <div className="mb-2 border-b border-gray-700 pb-2">
                  <select 
                      value={style.size} 
                      onChange={(e) => updateStyle('size', e.target.value)}
                      className="w-full bg-[#333] text-white text-xs border-none rounded p-1.5 focus:ring-1 focus:ring-[#01b3ef]"
                  >
                      <option value="Heading 1">Heading 1</option>
                      <option value="Heading 2">Heading 2</option>
                      <option value="Heading 3">Heading 3</option>
                      <option value="Heading 4">Heading 4</option>
                      <option value="Body Text">Body Text</option>
                      <option value="Small">Small</option>
                  </select>
              </div>

              {/* Row 2: Alignment */}
              <div className="flex justify-between items-center mb-2 border-b border-gray-700 pb-2">
                  <div className="flex bg-[#333] rounded p-0.5">
                      <button onClick={() => updateStyle('align', 'left')} className={`p-1.5 rounded ${style.align === 'left' ? 'bg-[#01b3ef] text-white' : 'text-gray-400 hover:text-white'}`}><AlignLeft className="w-3.5 h-3.5" /></button>
                      <button onClick={() => updateStyle('align', 'center')} className={`p-1.5 rounded ${style.align === 'center' ? 'bg-[#01b3ef] text-white' : 'text-gray-400 hover:text-white'}`}><AlignCenter className="w-3.5 h-3.5" /></button>
                      <button onClick={() => updateStyle('align', 'right')} className={`p-1.5 rounded ${style.align === 'right' ? 'bg-[#01b3ef] text-white' : 'text-gray-400 hover:text-white'}`}><AlignRight className="w-3.5 h-3.5" /></button>
                  </div>
              </div>

              {/* Row 3: Format & Lists */}
              <div className="flex justify-between items-center">
                  <div className="flex bg-[#333] rounded p-0.5">
                      <button onClick={() => updateStyle('bold', !style.bold)} className={`p-1.5 rounded ${style.bold ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}><Bold className="w-3.5 h-3.5" /></button>
                      <button onClick={() => updateStyle('italic', !style.italic)} className={`p-1.5 rounded ${style.italic ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}><Italic className="w-3.5 h-3.5" /></button>
                      <button onClick={() => updateStyle('underline', !style.underline)} className={`p-1.5 rounded ${style.underline ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}><Underline className="w-3.5 h-3.5" /></button>
                  </div>
                  
                  {/* List Toggles */}
                  <div className="flex bg-[#333] rounded p-0.5">
                      <button onClick={() => updateStyle('listType', style.listType === 'bullet' ? 'none' : 'bullet')} className={`p-1.5 rounded ${style.listType === 'bullet' ? 'bg-[#01b3ef] text-white' : 'text-gray-400 hover:text-white'}`}><List className="w-3.5 h-3.5" /></button>
                      <button onClick={() => updateStyle('listType', style.listType === 'number' ? 'none' : 'number')} className={`p-1.5 rounded ${style.listType === 'number' ? 'bg-[#01b3ef] text-white' : 'text-gray-400 hover:text-white'}`}><ListOrdered className="w-3.5 h-3.5" /></button>
                  </div>
              </div>
          </div>
      );
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col fixed inset-0 z-[50]" onClick={() => { setToolbarState(prev => ({...prev, visible: false})); setActiveStyleField(null); }}>
      
      {/* Top Header */}
      <header className="bg-white border-b border-[#afafaf]/30 h-16 flex justify-between items-center px-6 shrink-0 z-40 shadow-sm relative">
          <div className="flex items-center">
              <button 
                  onClick={() => setIsExitModalOpen(true)} 
                  className="mr-4 text-[#6c6c6c] hover:text-[#01427a] transition-colors p-2 hover:bg-slate-50 rounded-full"
              >
                  <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                  <h1 className="text-lg font-bold text-[#0c0c0d] leading-none">Course Editor</h1>
                  <span className="text-xs text-[#6c6c6c]">Design and structure your learning content</span>
              </div>
          </div>

          {/* Center Title */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 max-w-md">
               <div className="flex items-center justify-center gap-2">
                   <input 
                      type="text" 
                      value={courseTitle} 
                      onChange={(e) => setCourseTitle(e.target.value)}
                      className="text-center font-bold text-[#0c0c0d] bg-transparent border-b border-transparent hover:border-[#afafaf] focus:border-[#01b3ef] focus:ring-0 p-1 w-full truncate transition-colors text-lg"
                      placeholder="Untitled Course"
                  />
                  <span className="bg-slate-100 text-[#6c6c6c] text-[10px] px-2 py-0.5 rounded-full font-bold uppercase shrink-0 border border-[#afafaf]/20">Draft</span>
               </div>
          </div>
          
          <div className="flex items-center gap-4">
              <div className="hidden md:flex bg-slate-100 rounded-lg p-1">
                  <button 
                      onClick={() => setPreviewMode('mobile')}
                      className={`p-2 rounded ${previewMode === 'mobile' ? 'bg-white shadow-sm text-[#01b3ef]' : 'text-[#afafaf]'}`}
                      title="Mobile View"
                  >
                      <Smartphone className="w-4 h-4" />
                  </button>
                  <button 
                      onClick={() => setPreviewMode('tablet')}
                      className={`p-2 rounded ${previewMode === 'tablet' ? 'bg-white shadow-sm text-[#01b3ef]' : 'text-[#afafaf]'}`}
                      title="Tablet View"
                  >
                      <Tablet className="w-4 h-4" />
                  </button>
                  <button 
                      onClick={() => setPreviewMode('desktop')}
                      className={`p-2 rounded ${previewMode === 'desktop' ? 'bg-white shadow-sm text-[#01b3ef]' : 'text-[#afafaf]'}`}
                      title="Desktop View"
                  >
                      <Monitor className="w-4 h-4" />
                  </button>
              </div>
              <div className="h-6 w-px bg-[#afafaf]/30 hidden md:block"></div>
              <button onClick={() => setShowStyleEditor(true)} className="text-[#6c6c6c] font-bold text-sm hidden md:block hover:text-[#01b3ef]">Preview</button>
              <button onClick={handleSave} className="bg-[#01b3ef] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#01427a] shadow-md transition-colors flex items-center">
                  <Save className="w-4 h-4 mr-2" /> Save Changes
              </button>
          </div>
      </header>

      <div className="flex flex-1 overflow-hidden" onClick={() => setShowLessonMenu(false)}>
          
          {/* Left Sidebar: Outline (Resizable) */}
          <div 
            className="bg-white border-r border-[#afafaf]/30 flex flex-col shrink-0 relative"
            style={{ width: leftSidebarWidth }}
          >
              <div className="p-4 border-b border-[#afafaf]/30 flex justify-between items-center bg-slate-50 relative">
                  <span className="text-xs font-bold text-[#6c6c6c] uppercase">Course Outline</span>
                  <div className="relative">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowLessonMenu(!showLessonMenu); }}
                        className="bg-[#01b3ef] hover:bg-[#01427a] text-white p-2 rounded-md shadow-sm transition-colors flex items-center justify-center w-8 h-8"
                      >
                          <Plus className="w-6 h-6 stroke-[3px]" />
                      </button>
                      
                      {/* Lesson Menu Dropdown */}
                      {showLessonMenu && (
                          <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-[#afafaf]/20 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                              <button onClick={handleAddLesson} className="w-full text-left px-4 py-2 text-sm text-[#0c0c0d] hover:bg-slate-50 flex items-center">
                                  <LayoutIcon className="w-4 h-4 mr-2 text-[#6c6c6c]" /> New Lesson
                              </button>
                              <button onClick={handleAddSection} className="w-full text-left px-4 py-2 text-sm text-[#0c0c0d] hover:bg-slate-50 flex items-center">
                                  <List className="w-4 h-4 mr-2 text-[#6c6c6c]" /> New Section
                              </button>
                          </div>
                      )}
                  </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {sections.map((section, sIdx) => {
                      const showSectionHeader = !section.isDefault;

                      return (
                      <div 
                        key={section.id} 
                        className={`mb-2 ${dragOverId === section.id ? 'border-t-2 border-[#01b3ef]' : ''}`}
                        draggable={showSectionHeader}
                        onDragStart={(e) => handleDragStart(e, { type: 'SECTION', id: section.id, index: sIdx })}
                        onDragOver={(e) => handleDragOver(e, section.id)}
                        onDrop={(e) => {
                            if (draggedItem?.type === 'SECTION') {
                                handleDropSection(e, sIdx);
                            } else if (draggedItem?.type === 'LESSON') {
                                handleDropLesson(e, section.id, -1); 
                            }
                        }}
                      >
                          {/* SECTION HEADER (Conditional) */}
                          {showSectionHeader ? (
                              <div className={`group flex items-center p-2 rounded hover:bg-slate-50 relative cursor-grab active:cursor-grabbing ${section.title === 'Untitled Section' ? 'bg-amber-50 border-l-4 border-amber-400' : ''}`}>
                                  <div className="text-[#afafaf] hover:text-[#0c0c0d] mr-1 cursor-grab active:cursor-grabbing" title="Drag Section">
                                      <GripVertical className="w-4 h-4" />
                                  </div>
                                  <button onClick={() => toggleSectionCollapse(section.id)} className="text-[#afafaf] hover:text-[#0c0c0d] mr-1">
                                      {section.collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                  </button>
                                  <input 
                                      type="text" 
                                      value={section.title}
                                      onChange={(e) => updateSectionTitle(section.id, e.target.value)}
                                      className="text-xs font-extrabold text-[#6c6c6c] uppercase bg-transparent border-none focus:ring-0 p-0 w-full truncate"
                                  />
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); handleAddLessonToSection(section.id); }}
                                    className="ml-auto opacity-0 group-hover:opacity-100 p-1 text-[#01b3ef] hover:bg-[#01b3ef]/10 rounded transition-all"
                                    title="Add Lesson to this Section"
                                  >
                                      <Plus className="w-4 h-4" />
                                  </button>
                              </div>
                          ) : (
                              section.lessons.length > 0 && <div className="mb-2 border-b border-[#afafaf]/20 mx-2"></div>
                          )}

                          {/* LESSONS LIST */}
                          {!section.collapsed && (
                              <div className={`${showSectionHeader ? 'pl-2 space-y-1 min-h-[10px]' : 'space-y-1'}`}>
                                  {section.lessons.map((lesson, lIdx) => (
                                      <div 
                                        key={lesson.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, { type: 'LESSON', id: lesson.id, sectionId: section.id, index: lIdx })}
                                        onDragOver={(e) => handleDragOver(e, lesson.id)}
                                        onDrop={(e) => handleDropLesson(e, section.id, lIdx)}
                                        className={`${dragOverId === lesson.id ? 'border-t-2 border-[#01b3ef]' : ''}`}
                                      >
                                          {/* LESSON HEADER */}
                                          <div className={`group flex items-center px-3 py-3 rounded cursor-pointer ${activeLessonId === lesson.id ? 'bg-[#01b3ef]/10' : 'hover:bg-slate-100'}`}
                                              onClick={() => setActiveLessonId(lesson.id)}
                                          >
                                              <div 
                                                className={`mr-1 cursor-grab active:cursor-grabbing ${activeLessonId === lesson.id ? 'text-[#01b3ef]/50' : 'text-[#afafaf] hover:text-[#0c0c0d]'}`}
                                                title="Drag Lesson"
                                              >
                                                  <GripVertical className="w-3 h-3" />
                                              </div>

                                              <button onClick={(e) => { e.stopPropagation(); toggleLessonCollapse(lesson.id); }} className={`mr-1 ${activeLessonId === lesson.id ? 'text-[#01b3ef] hover:text-[#01427a]' : 'text-[#afafaf] hover:text-[#0c0c0d]'}`}>
                                                  {lesson.collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                              </button>
                                              <LayoutIcon className={`w-3 h-3 mr-2 shrink-0 ${activeLessonId === lesson.id ? 'text-[#01b3ef]' : 'text-[#afafaf]'}`} />
                                              
                                              {/* EDITABLE LESSON TITLE */}
                                              {editingLessonId === lesson.id ? (
                                                  <input 
                                                      type="text" 
                                                      value={lesson.title}
                                                      onChange={(e) => updateLessonTitle(lesson.id, e.target.value)}
                                                      onClick={(e) => e.stopPropagation()}
                                                      onBlur={() => setEditingLessonId(null)}
                                                      onKeyDown={(e) => {
                                                          if (e.key === 'Enter') setEditingLessonId(null);
                                                      }}
                                                      autoFocus
                                                      className={`text-sm font-bold bg-transparent border-b border-[#01b3ef] focus:ring-0 p-0 w-full truncate ${activeLessonId === lesson.id ? 'text-[#01427a]' : 'text-[#0c0c0d]'}`}
                                                  />
                                              ) : (
                                                  <span 
                                                      className={`text-sm font-bold w-full truncate select-none ${activeLessonId === lesson.id ? 'text-[#01427a]' : 'text-[#0c0c0d]'}`}
                                                      onDoubleClick={(e) => {
                                                          e.stopPropagation();
                                                          setEditingLessonId(lesson.id);
                                                      }}
                                                  >
                                                      {lesson.title}
                                                  </span>
                                              )}
                                          </div>

                                          {/* SLIDES LIST */}
                                          {!lesson.collapsed && (
                                              <div className="pl-6 pt-1 space-y-0.5 border-l border-[#afafaf]/20 ml-3">
                                                  {lesson.slides.map((slide, slideIdx) => (
                                                      <React.Fragment key={slide.id}>
                                                          {!slide.isLocked && (
                                                              <div className="h-1.5 -my-0.5 relative group/insert z-10">
                                                                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 group-hover/insert:bg-[#01b3ef] transition-colors flex justify-center items-center">
                                                                        <button 
                                                                            className="bg-[#01b3ef] text-white rounded-full p-0.5 opacity-0 group-hover/insert:opacity-100 transition-all transform scale-0 group-hover/insert:scale-100 shadow-sm"
                                                                            onClick={() => handleAddSlideAt(lesson.id, slideIdx)}
                                                                            title="Add Slide Here"
                                                                        >
                                                                            <Plus className="w-3 h-3" />
                                                                        </button>
                                                                    </div>
                                                              </div>
                                                          )}

                                                          <div 
                                                              draggable={!slide.isLocked}
                                                              onDragStart={(e) => handleDragStart(e, { type: 'SLIDE', id: slide.id, lessonId: lesson.id, index: slideIdx })}
                                                              onDragOver={(e) => handleDragOver(e, slide.id)}
                                                              onDrop={(e) => handleDropSlide(e, lesson.id, slideIdx)}
                                                              onClick={() => { setActiveLessonId(lesson.id); setActiveSlideId(slide.id); }}
                                                              className={`flex items-center justify-between px-2 py-1.5 text-xs rounded cursor-pointer group/slide relative ${activeSlideId === slide.id && activeLessonId === lesson.id ? 'bg-[#01b3ef]/10 text-[#01b3ef] font-bold border-l-2 border-[#01b3ef]' : 'text-[#6c6c6c] hover:bg-slate-50'} ${dragOverId === slide.id ? 'border-t-2 border-[#01b3ef]' : ''}`}
                                                          >
                                                              <div className="flex items-center truncate flex-1">
                                                                  {slide.isLocked ? (
                                                                      <div className="mr-2 text-[#afafaf] opacity-50" title="Locked Slide">
                                                                          <Lock className="w-3 h-3" />
                                                                      </div>
                                                                  ) : (
                                                                      <div 
                                                                        className="mr-2 cursor-grab active:cursor-grabbing text-[#afafaf] hover:text-[#0c0c0d] opacity-0 group-hover/slide:opacity-100"
                                                                        title="Drag to Reorder Slide"
                                                                      >
                                                                          <GripVertical className="w-3 h-3" />
                                                                      </div>
                                                                  )}
                                                                  <span className="mr-2 opacity-50 text-[10px] w-3">{slideIdx + 1}</span>
                                                                  <span className="truncate">{slide.title}</span>
                                                              </div>
                                                              {lesson.slides.length > 1 && !slide.isLocked && (
                                                                  <button 
                                                                    onClick={(e) => deleteSlide(e, slide.id)} 
                                                                    className="opacity-0 group-hover/slide:opacity-100 p-0.5 hover:text-[#e14177]"
                                                                  >
                                                                      <X className="w-3 h-3" />
                                                                  </button>
                                                              )}
                                                          </div>
                                                      </React.Fragment>
                                                  ))}
                                                  
                                                  <button 
                                                      onClick={() => { setActiveLessonId(lesson.id); handleAddSlideAppend(); }}
                                                      className="flex items-center px-2 py-1 text-[10px] text-[#01b3ef] font-bold hover:underline mt-1 w-full pl-6 opacity-60 hover:opacity-100"
                                                  >
                                                      <Plus className="w-3 h-3 mr-1" /> Add Slide
                                                  </button>
                                              </div>
                                          )}
                                      </div>
                                  ))}
                              </div>
                          )}
                      </div>
                  )})}
              </div>

              {/* Footer: Style Editor Button */}
              <div className="p-4 border-t border-[#afafaf]/30 bg-white shrink-0">
                  <button 
                      onClick={() => setShowStyleEditor(true)} 
                      className={`flex items-center justify-center w-full px-4 py-3 rounded-lg transition-colors border ${showStyleEditor ? 'bg-[#0c0c0d] text-white border-[#0c0c0d]' : 'bg-white text-[#6c6c6c] border-[#afafaf] hover:bg-[#0c0c0d] hover:text-white hover:border-[#0c0c0d]'}`}
                  >
                      <Palette className="w-5 h-5 mr-2" />
                      <span className="font-bold text-sm">Style Editor</span>
                  </button>
              </div>

              {/* Resizer Handle */}
              <div 
                className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-[#01b3ef] z-10 transition-colors"
                onMouseDown={startResizingLeft}
              ></div>
          </div>

          {/* MAIN EDITOR CONTENT AREA */}
          {showStyleEditor ? (
              // --- STYLE EDITOR VIEW ---
              <div className="fixed inset-0 z-[60] bg-slate-100 flex flex-col animate-in fade-in duration-300">
                  {/* TOP BAR */}
                  <div className="h-16 bg-white border-b border-[#afafaf]/30 flex justify-between items-center px-6 shrink-0">
                      <h2 className="font-bold text-lg text-[#0c0c0d]">Style editor</h2>
                      <div className="flex items-center gap-4">
                          <div className="flex bg-slate-100 rounded-lg p-1">
                              <button onClick={() => setPreviewMode('mobile')} className={`p-2 rounded ${previewMode === 'mobile' ? 'bg-white shadow-sm text-[#01b3ef]' : 'text-[#afafaf]'}`}><Smartphone className="w-4 h-4" /></button>
                              <button onClick={() => setPreviewMode('tablet')} className={`p-2 rounded ${previewMode === 'tablet' ? 'bg-white shadow-sm text-[#01b3ef]' : 'text-[#afafaf]'}`}><Tablet className="w-4 h-4" /></button>
                              <button onClick={() => setPreviewMode('desktop')} className={`p-2 rounded ${previewMode === 'desktop' ? 'bg-white shadow-sm text-[#01b3ef]' : 'text-[#afafaf]'}`}><Monitor className="w-4 h-4" /></button>
                          </div>
                          <div className="h-6 w-px bg-[#afafaf]/30"></div>
                          <button onClick={() => setShowStyleEditor(false)} className="bg-slate-100 hover:bg-slate-200 text-[#0c0c0d] px-4 py-2 rounded-lg font-bold text-sm transition-colors">Save changes</button>
                          <button onClick={() => setShowStyleEditor(false)} className="text-[#afafaf] hover:text-[#0c0c0d]"><X className="w-6 h-6" /></button>
                      </div>
                  </div>

                  <div className="flex flex-1 overflow-hidden">
                      {/* LEFT SIDEBAR - THEME NAVIGATION */}
                      <div className="w-[280px] bg-white border-r border-[#afafaf]/30 flex flex-col shrink-0">
                          <div className="p-6">
                              <button 
                                  onClick={() => setStyleEditorSelection('course')}
                                  className={`w-full flex items-center p-3 rounded-lg border transition-all ${styleEditorSelection === 'course' ? 'bg-[#01b3ef]/10 border-[#01b3ef] text-[#01b3ef]' : 'bg-slate-50 border-transparent hover:bg-slate-100 text-[#0c0c0d]'}`}
                              >
                                  <Palette className="w-5 h-5 mr-3" />
                                  <span className="font-bold text-sm">Course style</span>
                              </button>
                          </div>
                          
                          <div className="flex-1 overflow-y-auto px-6 pb-6">
                              <div className="mb-2 flex items-center text-xs font-bold text-[#6c6c6c] uppercase tracking-wider">
                                  <Layers className="w-3 h-3 mr-2" /> Lesson Styles
                              </div>
                              <div className="space-y-1">
                                  {sections.flatMap(s => s.lessons).map((lesson, idx) => (
                                      <button
                                          key={lesson.id}
                                          onClick={() => setStyleEditorSelection(lesson.id)}
                                          className={`w-full text-left flex items-start p-2 rounded transition-colors ${styleEditorSelection === lesson.id ? 'bg-slate-100 text-[#0c0c0d]' : 'text-[#6c6c6c] hover:bg-slate-50'}`}
                                      >
                                          <span className="text-xs font-mono mr-3 mt-0.5 w-4 text-right text-[#afafaf]">{idx + 1}</span>
                                          <span className="text-sm font-medium truncate">{lesson.title}</span>
                                      </button>
                                  ))}
                              </div>
                          </div>
                      </div>

                      {/* CENTER - PREVIEW */}
                      <div className="flex-1 bg-slate-100 flex items-center justify-center p-8 relative overflow-hidden">
                           <div className={`bg-white shadow-2xl border-[8px] border-[#0c0c0d] rounded-[30px] overflow-hidden transition-all duration-300 flex flex-col relative ${
                                previewMode === 'mobile' ? 'w-[375px] h-[667px]' : 
                                previewMode === 'tablet' ? 'w-[600px] h-[800px]' :
                                'w-[90%] h-[90%] rounded-lg border-2 border-[#afafaf]'
                            }`}>
                                {/* LOGO DISPLAY - Top Left of Device Frame */}
                                {courseLogo && (
                                    <img src={courseLogo} alt="Course Logo" className="absolute top-4 left-4 h-10 w-auto object-contain z-50" />
                                )}

                                <div className="bg-[#0033fa] h-16 w-full shrink-0 flex items-center justify-center text-white font-bold relative">
                                    <span className="absolute top-2 right-4 text-xs opacity-50">Preview</span>
                                    {styleEditorSelection === 'course' ? 'Course Style' : 'Lesson Style'}
                                </div>
                                <div className="flex-1 bg-white relative flex flex-col items-center justify-center p-8">
                                      <div className="absolute inset-0 bg-[#0033fa]"></div> 
                                      <div className="relative z-10 text-white text-center w-full">
                                          <h1 className="text-4xl font-extrabold mb-4">
                                              {styleEditorSelection === 'course' ? 'Course Title' : sections.flatMap(s=>s.lessons).find(l=>l.id === styleEditorSelection)?.title || 'Lesson Title'}
                                          </h1>
                                          <p className="text-white/80 text-lg mb-8">Subtitle or description goes here.</p>
                                          <button className="bg-white text-[#0033fa] px-8 py-3 rounded-full font-bold shadow-lg">Start</button>
                                      </div>
                                </div>
                           </div>
                      </div>

                      {/* RIGHT SIDEBAR - CONTROLS */}
                      <div className="w-[320px] bg-white border-l border-[#afafaf]/30 flex flex-col shrink-0">
                          <div className="p-4 border-b border-[#afafaf]/30 bg-slate-50">
                              <h3 className="font-bold text-[#0c0c0d] text-sm">
                                  {styleEditorSelection === 'course' ? 'Course Style' : 'Lesson Override'}
                              </h3>
                              <p className="text-xs text-[#6c6c6c]">
                                  {styleEditorSelection === 'course' ? 'Edit the style for all lessons in this course.' : 'Customize style for this specific lesson.'}
                              </p>
                          </div>
                          <div className="flex-1 overflow-y-auto p-6 space-y-8">
                               <div>
                                   <div className="flex items-center justify-between mb-2">
                                       <h3 className="font-bold text-[#0c0c0d] text-sm">Logo</h3>
                                       {courseLogo && <button onClick={() => setCourseLogo(null)} className="text-xs text-[#e14177] hover:underline">Remove</button>}
                                   </div>
                                   <div className="flex gap-3">
                                       <button 
                                            onClick={() => setCourseLogo(null)}
                                            className={`flex-1 py-3 border-2 rounded-lg text-xs font-bold flex flex-col items-center justify-center transition-colors ${!courseLogo ? 'border-[#01b3ef] bg-[#01b3ef]/5 text-[#01b3ef]' : 'border-[#afafaf]/30 bg-slate-50 text-[#6c6c6c] hover:bg-slate-100'}`}
                                       >
                                           <div className="w-6 h-6 rounded-full border-2 border-current mb-1 opacity-50"></div>
                                           None
                                       </button>
                                       <button 
                                            onClick={() => logoInputRef.current?.click()}
                                            className={`flex-1 py-3 border-2 rounded-lg text-xs font-bold flex flex-col items-center justify-center transition-colors ${courseLogo ? 'border-[#01b3ef] bg-[#01b3ef]/5 text-[#01b3ef]' : 'border-[#afafaf]/30 bg-slate-50 text-[#6c6c6c] hover:bg-slate-100'}`}
                                       >
                                           <Upload className="w-6 h-6 mb-1" />
                                           Upload
                                       </button>
                                       <input 
                                            type="file" 
                                            ref={logoInputRef}
                                            className="hidden" 
                                            accept="image/png, image/jpeg, image/webp" 
                                            onChange={handleLogoUpload} 
                                       />
                                   </div>
                                   <p className="text-[10px] text-[#afafaf] mt-2 flex items-start">
                                       <Info className="w-3 h-3 mr-1 mt-0.5" />
                                       Rec: PNG, JPG, WebP. Max 2MB. Approx 200x200px.
                                   </p>
                               </div>
                               <hr className="border-[#afafaf]/20" />
                               <div>
                                   <h3 className="font-bold text-[#0c0c0d] text-sm mb-2">Background</h3>
                                   <div className="flex gap-3">
                                       <button className="flex-1 py-3 border-2 border-[#01b3ef] bg-[#01b3ef]/5 text-[#01b3ef] rounded-lg text-xs font-bold flex flex-col items-center justify-center">
                                           <div className="w-6 h-6 bg-[#01b3ef] rounded mb-1 opacity-50"></div>
                                           Default
                                       </button>
                                       <button className="flex-1 py-3 border border-[#afafaf]/30 bg-slate-50 text-[#6c6c6c] rounded-lg text-xs font-bold hover:bg-slate-100 flex flex-col items-center justify-center transition-colors">
                                           <Plus className="w-6 h-6 mb-1" />
                                           Custom
                                       </button>
                                   </div>
                               </div>
                          </div>
                      </div>
                  </div>
              </div>
          ) : (
              // --- STANDARD SLIDE EDITOR VIEW ---
              <>
                  {/* Main Canvas: Editor */}
                  <div className="flex-1 bg-slate-100 flex items-center justify-center p-8 relative overflow-hidden">
                      
                      {/* Device Frame */}
                      <div 
                          className={`bg-white shadow-2xl border-[8px] border-[#0c0c0d] rounded-[30px] overflow-hidden transition-all duration-300 flex flex-col relative ${
                              previewMode === 'mobile' ? 'w-[375px] h-[667px]' : 
                              previewMode === 'tablet' ? 'w-[600px] h-[800px]' :
                              'w-[90%] h-[90%] rounded-lg border-2 border-[#afafaf]'
                          }`}
                      >
                          {/* LOGO DISPLAY - Top Left of Device Frame */}
                          {courseLogo && (
                              <img src={courseLogo} alt="Course Logo" className="absolute top-4 left-4 h-10 w-auto object-contain z-50" />
                          )}

                          {/* Canvas Header */}
                          <div className="bg-[#0033fa] h-16 w-full shrink-0 flex items-center justify-center text-white font-bold relative">
                              <span className="absolute top-2 right-4 text-xs opacity-50">Slide Editor</span>
                          </div>

                          {/* Slide Content (Editable) */}
                          <div className="flex-1 bg-white flex flex-col relative overflow-y-auto">
                                {currentSlideData ? (
                                    <div className="h-full flex flex-col">
                                        {currentSlideData.type === 'Form' ? (
                                            /* FORM SLIDE RENDER */
                                            <div className="flex flex-col h-full animate-in fade-in zoom-in duration-300 p-6">
                                                <h2 className="text-2xl font-bold text-[#0c0c0d] mb-2 text-center">{currentSlideData.title}</h2>
                                                <p className="text-sm text-[#6c6c6c] text-center mb-8">{currentSlideData.subtitle}</p>
                                                <div className="flex-1 border-2 border-dashed border-[#afafaf] rounded-xl bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
                                                    <FileText className="w-12 h-12 text-[#afafaf] mx-auto mb-3 opacity-50" />
                                                    <p className="text-sm text-[#6c6c6c] font-bold">Form Embed Placeholder</p>
                                                </div>
                                            </div>
                                        ) : currentSlideData.type === 'Embed' ? (
                                            /* --- EMBED SLIDE RENDERER --- */
                                            <div className="flex flex-col h-full animate-in fade-in duration-300">
                                                <div className="p-6 border-b border-slate-100 bg-white">
                                                    <h2 className="text-xl font-bold text-[#0c0c0d] mb-1">{currentSlideData.title}</h2>
                                                    <p className="text-xs text-[#afafaf] truncate">{currentSlideData.formData?.url || 'No URL provided'}</p>
                                                </div>
                                                <div className="flex-1 bg-slate-50 relative overflow-hidden">
                                                    {currentSlideData.formData?.url ? (
                                                        <iframe 
                                                            src={currentSlideData.formData.url} 
                                                            className="w-full h-full border-none"
                                                            title="Embed Preview"
                                                            referrerPolicy="no-referrer"
                                                        />
                                                    ) : (
                                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-[#6c6c6c]">
                                                            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-[#01b3ef]">
                                                                <Globe className="w-8 h-8" />
                                                            </div>
                                                            <p className="font-bold mb-1">External Webpage</p>
                                                            <p className="text-xs max-w-[200px]">Add a URL in the properties panel to display it here.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ) : currentSlideData.type === 'Activity' ? (
                                            /* --- NEW ACTIVITY SLIDE RENDERER --- */
                                            <div className="relative h-full flex flex-col bg-[#0c0c0d]">
                                                {/* Video Area (Top 40%) */}
                                                <div className="relative h-[40%] bg-black group/video cursor-pointer" onClick={() => updateFormData('videoUrl', 'clicked')}>
                                                    {/* Placeholder or Image */}
                                                    <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-white/50">
                                                        <Video className="w-12 h-12" />
                                                    </div>
                                                    <div className="absolute inset-0 bg-black/40 hover:bg-black/20 transition-all flex flex-col items-center justify-center p-4 text-center">
                                                        <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full font-bold text-white text-sm mb-2 hover:bg-white/30 transition-colors">
                                                            Attach Video Link
                                                        </span>
                                                    </div>
                                                    {/* Progress Bar (Mock) */}
                                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20">
                                                        <div className="h-full bg-[#01b3ef] w-1/3"></div>
                                                    </div>
                                                </div>

                                                {/* Bottom Sheet Area (Bottom 60% with Animation) */}
                                                <div className="flex-1 bg-white rounded-t-[2rem] p-6 relative -mt-6 z-10 flex flex-col shadow-2xl transition-all duration-500 overflow-hidden">
                                                    {/* Drag Handle Indicator */}
                                                    <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 shrink-0"></div>

                                                    {/* CONTENT CONTAINER - ANIMATED SWITCH */}
                                                    <div className="flex-1 relative overflow-hidden">
                                                        {/* STATE 1: INTRO & INSTRUCTIONS */}
                                                        <div className={`absolute inset-0 flex flex-col transition-all duration-500 ${activityStep === 'intro' ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
                                                            <div className="flex-1 overflow-y-auto mb-4">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <span className="bg-[#01b3ef]/10 text-[#01b3ef] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Activity</span>
                                                                    <span className="text-[10px] text-[#afafaf] font-bold uppercase tracking-wider">15 Mins</span>
                                                                </div>
                                                                
                                                                <input 
                                                                    type="text" 
                                                                    className="w-full text-2xl font-extrabold text-[#0c0c0d] border-none p-0 focus:ring-0 mb-4 bg-transparent placeholder-slate-300"
                                                                    value={currentSlideData.title}
                                                                    onChange={(e) => updateSlideField('title', e.target.value)}
                                                                    placeholder="Activity Title"
                                                                />

                                                                <div className="prose prose-sm max-w-none">
                                                                    <h4 className="text-xs font-bold text-[#01427a] uppercase mb-2">Instructions</h4>
                                                                    <textarea 
                                                                        className="w-full border-none p-0 text-sm text-[#6c6c6c] leading-relaxed resize-none focus:ring-0 bg-transparent"
                                                                        rows={4}
                                                                        value={currentSlideData.formData?.instructions || ''}
                                                                        onChange={(e) => updateFormData('instructions', e.target.value)}
                                                                        placeholder="Enter instructions for the student here..."
                                                                    />
                                                                </div>
                                                            </div>

                                                            <button 
                                                                onClick={() => setActivityStep('reflection')}
                                                                className="w-full py-4 bg-[#01427a] text-white rounded-xl font-bold shadow-lg hover:bg-[#003366] transition-all flex items-center justify-center group/btn"
                                                            >
                                                                {currentSlideData.buttonText || 'Start Reflection'}
                                                                <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                                            </button>
                                                        </div>

                                                        {/* STATE 2: REFLECTION INPUT */}
                                                        <div className={`absolute inset-0 flex flex-col transition-all duration-500 ${activityStep === 'reflection' ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}>
                                                            <button 
                                                                onClick={() => setActivityStep('intro')}
                                                                className="text-xs font-bold text-[#afafaf] hover:text-[#01427a] mb-4 flex items-center self-start"
                                                            >
                                                                <ChevronDown className="w-4 h-4 mr-1 rotate-180" /> Back to Instructions
                                                            </button>

                                                            <div className="flex-1 overflow-y-auto">
                                                                <h3 className="text-lg font-bold text-[#0c0c0d] mb-4">Self Reflection</h3>
                                                                
                                                                <div className="bg-[#01b3ef]/5 p-4 rounded-xl border border-[#01b3ef]/20 mb-4">
                                                                    <textarea 
                                                                        className="w-full bg-transparent border-none p-0 text-sm font-medium text-[#01427a] resize-none focus:ring-0 placeholder-[#01427a]/50"
                                                                        rows={2}
                                                                        value={currentSlideData.formData?.prompt || ''}
                                                                        onChange={(e) => updateFormData('prompt', e.target.value)}
                                                                        placeholder="Enter the reflection question here..."
                                                                    />
                                                                </div>

                                                                <textarea 
                                                                    className="w-full border border-[#afafaf]/30 rounded-xl p-4 text-sm focus:border-[#01b3ef] focus:ring-[#01b3ef] min-h-[150px] resize-none bg-slate-50"
                                                                    placeholder="Student answer area (Preview)"
                                                                    disabled
                                                                />
                                                            </div>

                                                            <button 
                                                                className="w-full py-4 bg-[#01b3ef] text-white rounded-xl font-bold shadow-lg mt-4 opacity-50 cursor-not-allowed"
                                                            >
                                                                Submit Response
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            /* STANDARD SLIDE RENDER (Title / Text / End) */
                                            <div className={`animate-in fade-in zoom-in duration-300 w-full h-full flex flex-col relative text-white p-8 ${currentSlideData.type === 'End' ? 'bg-[#22c55e]' : 'bg-[#0033fa]'}`}>
                                                
                                                {currentSlideData.type === 'End' && (
                                                    <div className="mb-4 text-center">
                                                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm mx-auto mb-2">
                                                            <CheckSquare className="w-8 h-8 text-white" />
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex-1 flex flex-col justify-center items-center w-full">
                                                    <input 
                                                        type="text" 
                                                        className={`bg-transparent border-b border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white w-full mb-2 pb-2 transition-all ${getStyleClass(currentSlideData.titleStyle)}`}
                                                        value={currentSlideData.title}
                                                        placeholder="Add Title"
                                                        onChange={(e) => updateSlideField('title', e.target.value)}
                                                        onMouseUp={(e) => handleMouseUp(e, 'title')}
                                                    />
                                                    
                                                    {/* SUBHEADING INPUT */}
                                                    <input 
                                                        type="text"
                                                        className={`bg-transparent border-none text-white/90 placeholder-white/40 focus:outline-none w-full mb-4 transition-all ${getStyleClass(currentSlideData.subheadingStyle)}`}
                                                        value={currentSlideData.subheading}
                                                        placeholder="Add Sub-heading"
                                                        onChange={(e) => updateSlideField('subheading', e.target.value)}
                                                        onMouseUp={(e) => handleMouseUp(e, 'subheading')}
                                                    />

                                                    {/* Display Only Body Text - HIDDEN FOR TITLE SLIDES */}
                                                    {currentSlideData.type !== 'Title' && (
                                                        <div className="w-full mb-6 relative group" onClick={() => setEditingSubtitle(true)}>
                                                            {editingSubtitle ? (
                                                                <textarea
                                                                    autoFocus
                                                                    value={currentSlideData.subtitle}
                                                                    onChange={(e) => updateSlideField('subtitle', e.target.value)}
                                                                    onBlur={() => setEditingSubtitle(false)}
                                                                    className={`bg-transparent border-2 border-dashed border-[#afafaf]/50 w-full resize-none focus:outline-none p-2 rounded ${getStyleClass(currentSlideData.subtitleStyle)}`}
                                                                    rows={5}
                                                                    placeholder="Click to add text..."
                                                                    onMouseUp={(e) => handleMouseUp(e, 'subtitle')}
                                                                />
                                                            ) : (
                                                                <div className={`cursor-text min-h-[50px] p-2 border-2 border-transparent hover:border-dashed hover:border-[#afafaf]/50 rounded ${getStyleClass(currentSlideData.subtitleStyle)}`}>
                                                                   {currentSlideData.subtitle ? renderBodyContent(currentSlideData.subtitle, currentSlideData.subtitleStyle) : <span className="opacity-50">Click to add text...</span>}
                                                                </div>
                                                            )}
                                                            {/* Settings Icon for Body */}
                                                            {!editingSubtitle && (
                                                                 <div className="absolute -right-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                     <button onClick={(e) => { e.stopPropagation(); setActiveStyleField('subtitle'); }} className="p-1 bg-white rounded-full shadow-sm text-[#afafaf] hover:text-[#01b3ef]">
                                                                         <Settings className="w-4 h-4" />
                                                                     </button>
                                                                 </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className={`mt-auto w-full ${currentSlideData.buttonStyle?.align === 'left' ? 'text-left' : currentSlideData.buttonStyle?.align === 'right' ? 'text-right' : 'text-center'}`}>
                                                    <button className={`px-8 py-3 rounded-full font-bold shadow-lg transform hover:scale-105 transition-transform ${currentSlideData.type === 'End' ? 'text-[#22c55e] bg-white' : 'text-[#0033fa] bg-white'}`}>
                                                        {currentSlideData.buttonText || 'Continue'}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-full text-[#afafaf]">
                                        Select a slide
                                    </div>
                                )}
                          </div>

                          {/* Canvas Footer */}
                          {currentSlideData?.type !== 'Form' && currentSlideData?.type !== 'Activity' && (
                              <div className="h-16 bg-white flex items-center justify-center shrink-0 border-t border-[#afafaf]/10">
                                  <div className="h-1 bg-slate-200 w-1/3 rounded-full"></div>
                              </div>
                          )}
                      </div>

                  </div>

                  {/* Right Sidebar: Properties (Resizable) */}
                  <div 
                    className="bg-white border-l border-[#afafaf]/30 flex flex-col shrink-0 relative"
                    style={{ width: rightSidebarWidth }}
                  >
                        <div 
                            className="absolute top-0 left-0 w-1 h-full cursor-col-resize hover:bg-[#01b3ef] z-10 transition-colors"
                            onMouseDown={startResizingRight}
                        ></div>

                        <div className="p-4 border-b border-[#afafaf]/30 bg-slate-50">
                            <span className="text-xs font-bold text-[#6c6c6c] uppercase">Properties</span>
                        </div>
                        {currentSlideData && (
                            <div className="p-6 space-y-6 overflow-y-auto">
                                <div className="pb-6 border-b border-[#afafaf]/30">
                                    <label className="block text-xs font-bold text-[#01427a] uppercase mb-2">Lesson Title</label>
                                    <input 
                                        type="text" 
                                        className="w-full border border-[#afafaf] rounded p-2 text-sm focus:border-[#01b3ef] outline-none font-bold" 
                                        value={currentLesson?.title || ''} 
                                        onChange={(e) => {
                                            if(currentLesson) updateLessonTitle(currentLesson.id, e.target.value);
                                        }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-2">Slide Type</label>
                                    <div className="flex items-center">
                                        <span className={`text-xs px-2 py-1 rounded font-bold ${currentSlideData.isLocked ? 'bg-orange-100 text-orange-700' : 'bg-[#01b3ef]/10 text-[#01b3ef]'}`}>
                                            {currentSlideData.type}
                                        </span>
                                    </div>
                                </div>
                                
                                {currentSlideData.type === 'Activity' ? (
                                    /* --- ACTIVITY SPECIFIC PROPERTIES --- */
                                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                        <div>
                                            <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-2">Activity Title</label>
                                            <input 
                                                type="text" 
                                                className="w-full border border-[#afafaf] rounded p-2 text-sm focus:border-[#01b3ef] outline-none" 
                                                value={currentSlideData.title} 
                                                onChange={(e) => updateSlideField('title', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-2">Video Source URL</label>
                                            <input 
                                                type="text" 
                                                className="w-full border border-[#afafaf] rounded p-2 text-sm focus:border-[#01b3ef] outline-none" 
                                                value={currentSlideData.formData?.videoUrl || ''} 
                                                onChange={(e) => updateFormData('videoUrl', e.target.value)}
                                                placeholder="https://..."
                                            />
                                            <button className="mt-2 text-xs font-bold text-[#01b3ef] flex items-center">
                                                <Upload className="w-3 h-3 mr-1" /> Upload Video File
                                            </button>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-2">Instructions Text</label>
                                            <textarea 
                                                rows={4}
                                                className="w-full border border-[#afafaf] rounded p-2 text-sm focus:border-[#01b3ef] outline-none resize-none" 
                                                value={currentSlideData.formData?.instructions || ''} 
                                                onChange={(e) => updateFormData('instructions', e.target.value)}
                                                placeholder="Explain the task..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-2">Reflection Question</label>
                                            <textarea 
                                                rows={2}
                                                className="w-full border border-[#afafaf] rounded p-2 text-sm focus:border-[#01b3ef] outline-none resize-none" 
                                                value={currentSlideData.formData?.prompt || ''} 
                                                onChange={(e) => updateFormData('prompt', e.target.value)}
                                                placeholder="What should the student reflect on?"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-2">Button Label</label>
                                            <input 
                                                type="text" 
                                                className="w-full border border-[#afafaf] rounded p-2 text-sm focus:border-[#01b3ef] outline-none" 
                                                value={currentSlideData.buttonText || ''} 
                                                onChange={(e) => updateSlideField('buttonText', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ) : currentSlideData.type === 'Embed' ? (
                                    /* --- EMBED SPECIFIC PROPERTIES --- */
                                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                        <div>
                                            <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-2">Display Title</label>
                                            <input 
                                                type="text" 
                                                className="w-full border border-[#afafaf] rounded p-2 text-sm focus:border-[#01b3ef] outline-none font-bold" 
                                                value={currentSlideData.title} 
                                                onChange={(e) => updateSlideField('title', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-[#6c6c6c] uppercase mb-2">Source URL</label>
                                            <div className="flex gap-2">
                                                <input 
                                                    type="text" 
                                                    className="flex-1 border border-[#afafaf] rounded p-2 text-sm focus:border-[#01b3ef] outline-none" 
                                                    value={currentSlideData.formData?.url || ''} 
                                                    onChange={(e) => updateFormData('url', e.target.value)}
                                                    placeholder="https://..."
                                                />
                                                <div className="bg-slate-100 p-2 rounded border border-[#afafaf]">
                                                    <LinkIcon className="w-4 h-4 text-[#6c6c6c]" />
                                                </div>
                                            </div>
                                            <p className="text-[10px] text-[#afafaf] mt-2">
                                                Note: Some websites may block embedding via iframe for security reasons.
                                            </p>
                                        </div>
                                        <div className="p-4 bg-[#01b3ef]/5 rounded-lg border border-[#01b3ef]/20">
                                            <h4 className="text-xs font-bold text-[#01427a] mb-2 flex items-center">
                                                <Monitor className="w-3 h-3 mr-2" /> Responsiveness
                                            </h4>
                                            <p className="text-[10px] text-[#6c6c6c]">
                                                The embed will automatically adapt to the screen size of the learner's device (Phone, Tablet, or Laptop).
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    /* --- STANDARD PROPERTIES --- */
                                    <>
                                        <div className="relative">
                                            <div className="flex justify-between items-center mb-1">
                                                <label className="block text-xs font-bold text-[#6c6c6c] uppercase">Slide Title</label>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); setActiveStyleField(activeStyleField === 'title' ? null : 'title'); }}
                                                    className={`p-1 rounded hover:bg-slate-100 ${activeStyleField === 'title' ? 'text-[#01b3ef] bg-[#01b3ef]/10' : 'text-[#afafaf]'}`}
                                                >
                                                    <Settings className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <input 
                                                type="text" 
                                                className="w-full border border-[#afafaf] rounded p-2 text-sm focus:border-[#01b3ef] outline-none" 
                                                value={currentSlideData.title} 
                                                onChange={(e) => updateSlideField('title', e.target.value)}
                                            />
                                            {activeStyleField === 'title' && <StylePopup field="title" />}
                                        </div>

                                        {/* NEW SUBHEADING PROPERTY */}
                                        <div className="relative">
                                            <div className="flex justify-between items-center mb-1">
                                                <label className="block text-xs font-bold text-[#6c6c6c] uppercase">Sub-heading</label>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); setActiveStyleField(activeStyleField === 'subheading' ? null : 'subheading'); }}
                                                    className={`p-1 rounded hover:bg-slate-100 ${activeStyleField === 'subheading' ? 'text-[#01b3ef] bg-[#01b3ef]/10' : 'text-[#afafaf]'}`}
                                                >
                                                    <Settings className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <input 
                                                type="text" 
                                                className="w-full border border-[#afafaf] rounded p-2 text-sm focus:border-[#01b3ef] outline-none" 
                                                value={currentSlideData.subheading || ''} 
                                                onChange={(e) => updateSlideField('subheading', e.target.value)}
                                                placeholder="Optional sub-heading"
                                            />
                                            {activeStyleField === 'subheading' && <StylePopup field="subheading" />}
                                        </div>

                                        {/* BODY TEXT PROPERTY */}
                                        {currentSlideData.type !== 'Title' && currentSlideData.type !== 'Form' && (
                                            <div className="relative">
                                                <div className="flex justify-between items-center mb-1">
                                                    <label className="block text-xs font-bold text-[#6c6c6c] uppercase">Body Text</label>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); setActiveStyleField(activeStyleField === 'subtitle' ? null : 'subtitle'); }}
                                                        className={`p-1 rounded hover:bg-slate-100 ${activeStyleField === 'subtitle' ? 'text-[#01b3ef] bg-[#01b3ef]/10' : 'text-[#afafaf]'}`}
                                                    >
                                                        <Settings className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <textarea 
                                                    rows={4}
                                                    className="w-full border border-[#afafaf] rounded p-2 text-sm focus:border-[#01b3ef] outline-none resize-none" 
                                                    value={currentSlideData.subtitle || ''} 
                                                    onChange={(e) => updateSlideField('subtitle', e.target.value)}
                                                    placeholder="Content..."
                                                />
                                                {activeStyleField === 'subtitle' && <StylePopup field="subtitle" />}
                                            </div>
                                        )}

                                        {/* NEW BUTTON TEXT PROPERTY */}
                                        {currentSlideData.type !== 'Form' && (
                                            <div className="relative">
                                                <div className="flex justify-between items-center mb-1">
                                                    <label className="block text-xs font-bold text-[#6c6c6c] uppercase">Button Text</label>
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); setActiveStyleField(activeStyleField === 'button' ? null : 'button'); }}
                                                        className={`p-1 rounded hover:bg-slate-100 ${activeStyleField === 'button' ? 'text-[#01b3ef] bg-[#01b3ef]/10' : 'text-[#afafaf]'}`}
                                                    >
                                                        <Settings className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <input 
                                                    type="text" 
                                                    className="w-full border border-[#afafaf] rounded p-2 text-sm focus:border-[#01b3ef] outline-none" 
                                                    value={currentSlideData.buttonText || ''} 
                                                    onChange={(e) => updateSlideField('buttonText', e.target.value)}
                                                    placeholder="Continue"
                                                />
                                                {activeStyleField === 'button' && <StylePopup field="button" />}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                  </div>
              </>
          )}
      </div>

      {/* TEXT SELECTION TOOLBAR - Only shows when actively clicking around, separate from property panel popups */}
      {toolbarState.visible && !activeStyleField && (
          <div 
              className="absolute z-[100] flex items-center bg-[#1e1e1e] rounded-lg shadow-xl border border-[#333] px-2 py-1.5 animate-in fade-in zoom-in duration-200"
              style={{ top: toolbarState.y, left: toolbarState.x }}
              onMouseDown={(e) => e.stopPropagation()} 
          >
              <div className="relative border-r border-gray-600 pr-2 mr-2">
                  <button 
                      onClick={() => setShowSizeDropdown(!showSizeDropdown)}
                      className="text-white text-xs font-medium flex items-center px-2 py-1.5 hover:bg-white/10 rounded transition-colors"
                  >
                      {getCurrentStyle().size} <ChevronDown className="w-3 h-3 ml-1" />
                  </button>
                  {showSizeDropdown && (
                      <div className="absolute top-full left-0 mt-2 w-32 bg-[#1e1e1e] border border-[#333] rounded-lg shadow-xl overflow-hidden py-1 z-50">
                          {['Heading 1', 'Heading 2', 'Heading 3', 'Heading 4', 'Body Text', 'Small'].map((size) => (
                              <button 
                                  key={size}
                                  onClick={() => { applyStyle('size', size); setShowSizeDropdown(false); }}
                                  className={`w-full text-left px-3 py-2 text-xs text-white hover:bg-[#01b3ef] transition-colors ${getCurrentStyle().size === size ? 'bg-white/10' : ''}`}
                              >
                                  {size}
                              </button>
                          ))}
                      </div>
                  )}
              </div>
              <div className="flex gap-1 items-center border-r border-gray-600 pr-2 mr-2">
                  <button onClick={() => applyStyle('bold', !getCurrentStyle().bold)} className={`p-1.5 rounded transition-colors ${getCurrentStyle().bold ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`}><Bold className="w-3.5 h-3.5" /></button>
                  <button onClick={() => applyStyle('italic', !getCurrentStyle().italic)} className={`p-1.5 rounded transition-colors ${getCurrentStyle().italic ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`}><Italic className="w-3.5 h-3.5" /></button>
                  <button onClick={() => applyStyle('underline', !getCurrentStyle().underline)} className={`p-1.5 rounded transition-colors ${getCurrentStyle().underline ? 'bg-white text-black' : 'text-white hover:bg-white/10'}`}><Underline className="w-3.5 h-3.5" /></button>
              </div>
          </div>
      )}

      {/* SLIDE LIBRARY MODAL */}
      {showSlideLibrary && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                  {/* Header */}
                  <div className="p-4 border-b border-[#afafaf]/30 flex justify-between items-center bg-white shrink-0">
                      <div>
                          <h2 className="font-bold text-lg text-[#0c0c0d]">Slide library</h2>
                      </div>
                      <div className="flex items-center gap-4">
                          <div className="relative">
                              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#afafaf]" />
                              <input 
                                  type="text" 
                                  placeholder="Search" 
                                  className="pl-9 pr-3 py-1.5 border border-[#afafaf] rounded-lg text-sm focus:ring-[#01b3ef] focus:border-[#01b3ef]"
                              />
                          </div>
                          <button onClick={() => setShowSlideLibrary(false)}><X className="text-[#afafaf] hover:text-[#0c0c0d]" /></button>
                      </div>
                  </div>

                  <div className="flex flex-1 overflow-hidden">
                      {/* Left Panel: Categories */}
                      <div className="w-64 border-r border-[#afafaf]/30 bg-white flex flex-col overflow-y-auto shrink-0">
                          {SLIDE_LIBRARY_CATEGORIES.map((cat, idx) => (
                              <div key={idx} className="p-4 pb-0">
                                  <h3 className="text-xs font-bold text-[#6c6c6c] uppercase mb-2 px-2">{cat.title}</h3>
                                  <div className="space-y-1 mb-4">
                                      {cat.items.map((item) => (
                                          <button 
                                              key={item.id}
                                              onClick={() => setSelectedLibraryCategory(item.id)}
                                              className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                                  selectedLibraryCategory === item.id 
                                                  ? 'bg-white border-2 border-[#01b3ef] text-[#01b3ef] shadow-sm' 
                                                  : 'text-[#0c0c0d] hover:bg-slate-50 border-2 border-transparent'
                                              }`}
                                          >
                                              <item.icon className={`w-4 h-4 mr-3 ${selectedLibraryCategory === item.id ? 'text-[#01b3ef]' : 'text-[#6c6c6c]'}`} />
                                              {item.label}
                                          </button>
                                      ))}
                                  </div>
                                  {idx < SLIDE_LIBRARY_CATEGORIES.length - 1 && <div className="h-px bg-[#afafaf]/20 mx-2"></div>}
                              </div>
                          ))}
                      </div>

                      {/* Right Panel: Grid */}
                      <div className="flex-1 bg-slate-50 p-8 overflow-y-auto">
                          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                              {(SLIDE_TEMPLATES[selectedLibraryCategory] || GENERIC_TEMPLATES).map((template, tIdx) => (
                                  <div 
                                      key={tIdx}
                                      onClick={() => handleSelectSlideType(template.type, template.title)}
                                      className="bg-white p-6 rounded-xl border border-[#afafaf]/30 hover:border-[#01b3ef] hover:shadow-md cursor-pointer transition-all group flex flex-col h-full"
                                  >
                                      <div className="aspect-[4/3] bg-slate-50 rounded-lg mb-4 flex items-center justify-center border border-[#afafaf]/10 group-hover:bg-[#01b3ef]/5 transition-colors">
                                          {template.icon ? (
                                              <template.icon className="w-10 h-10 text-[#afafaf] group-hover:text-[#01b3ef]" />
                                          ) : (
                                              <LayoutIcon className="w-10 h-10 text-[#afafaf] group-hover:text-[#01b3ef]" />
                                          )}
                                      </div>
                                      <h4 className="font-bold text-[#0c0c0d] mb-1 group-hover:text-[#01b3ef]">{template.title}</h4>
                                      <p className="text-xs text-[#6c6c6c] leading-relaxed">{template.description}</p>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* EXIT WARNING MODAL */}
      {isExitModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in duration-200">
                  <div className="bg-[#e14177] px-6 py-4 flex justify-between items-center">
                      <h2 className="text-lg font-bold text-white flex items-center">
                          <AlertTriangle className="w-5 h-5 mr-2" /> Unsaved Changes
                      </h2>
                      <button onClick={() => setIsExitModalOpen(false)} className="text-white/70 hover:text-white">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  <div className="p-6">
                      <p className="text-[#0c0c0d] font-medium text-lg mb-2">Do you want to save first before returning?</p>
                      <p className="text-[#6c6c6c] text-sm">Otherwise, you'll lose your course progress.</p>
                  </div>
                  <div className="p-4 bg-slate-50 border-t border-[#afafaf]/30 flex justify-end gap-2 flex-wrap">
                      <button 
                          onClick={() => setIsExitModalOpen(false)}
                          className="px-4 py-2 border border-[#afafaf] text-[#6c6c6c] rounded font-bold hover:bg-white transition-colors"
                      >
                          Cancel
                      </button>
                      <button 
                          onClick={() => navigate('/creator-dashboard')}
                          className="px-4 py-2 bg-red-100 text-red-700 border border-red-200 rounded font-bold hover:bg-red-200 transition-colors"
                      >
                          Exit Without Saving
                      </button>
                      <button 
                          onClick={() => {
                              setIsExitModalOpen(false);
                              handleSave();
                          }}
                          className="px-4 py-2 bg-[#01b3ef] text-white rounded font-bold hover:bg-[#01427a] transition-colors shadow-sm"
                      >
                          Save & Exit
                      </button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default CreatorCourseBuilder;
