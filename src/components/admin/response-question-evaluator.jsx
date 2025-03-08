import React, { useState, useEffect } from "react";
import { useResponseEvaluation } from "@/contexts/response-evaluation-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  FileText,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Lightbulb,
  Edit3,
  BarChart2,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const ResponseQuestionEvaluator = ({
  examId,
  responseId,
  questionId,
  studentAnswer,
  questionText,
  questionType,
  correctAnswer,
  maxScore = 10,
  onEvaluationComplete,
}) => {
  const {
    submitEvaluation,
    getEvaluation,
    fetchEvaluationCriteria,
    getCriteria,
    loading,
  } = useResponseEvaluation();

  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [criteria, setCriteria] = useState([]);
  const [activeTab, setActiveTab] = useState("evaluation");
  const [existingEvaluation, setExistingEvaluation] = useState(null);
  const [showAIAssist, setShowAIAssist] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [evaluationNotes, setEvaluationNotes] = useState("");
  const [criteriaScores, setCriteriaScores] = useState({});
  const [saving, setSaving] = useState(false);

  // Load existing evaluation if available
  useEffect(() => {
    const evaluation = getEvaluation(examId, responseId, questionId);
    if (evaluation) {
      setExistingEvaluation(evaluation);
      setScore(evaluation.score || 0);
      setFeedback(evaluation.feedback || "");
      setEvaluationNotes(evaluation.notes || "");
      if (evaluation.criteriaScores) {
        setCriteriaScores(evaluation.criteriaScores);
      }
    } else {
      // Reset state for new evaluation
      setScore(0);
      setFeedback("");
      setEvaluationNotes("");
      setCriteriaScores({});
    }
  }, [examId, responseId, questionId, getEvaluation]);

  // Load evaluation criteria
  useEffect(() => {
    const loadCriteria = async () => {
      try {
        // Try to get from context first
        let criteriaData = getCriteria(examId, questionId);

        // If not available, fetch from API
        if (!criteriaData || criteriaData.length === 0) {
          criteriaData = await fetchEvaluationCriteria(examId, questionId);
        }

        if (criteriaData) {
          setCriteria(criteriaData);

          // Initialize criteria scores
          const initialScores = {};
          for (const criterion of criteriaData) {
            initialScores[criterion.id] = criteriaScores[criterion.id] || 0;
          }
          setCriteriaScores(initialScores);
        }
      } catch (error) {
        console.error("Error loading criteria:", error);
        // Set default criteria if none available
        const defaultCriteria = [
          {
            id: "accuracy",
            name: "Accuracy",
            description: "Correctness of the answer",
          },
          {
            id: "completeness",
            name: "Completeness",
            description: "How thoroughly the question was answered",
          },
          {
            id: "reasoning",
            name: "Reasoning",
            description: "Quality of explanation and logic",
          },
        ];
        setCriteria(defaultCriteria);

        // Initialize criteria scores
        const initialScores = {};
        for (const criterion of defaultCriteria) {
          initialScores[criterion.id] = criteriaScores[criterion.id] || 0;
        }
        setCriteriaScores(initialScores);
      }
    };

    if (examId && questionId) {
      loadCriteria();
    }
  }, [
    examId,
    questionId,
    fetchEvaluationCriteria,
    getCriteria,
    criteriaScores,
  ]);

  // Generate AI suggestion for evaluation
  const generateAISuggestion = async () => {
    setShowAIAssist(true);
    try {
      // Simulate AI response - in a real app, this would call an AI service
      setTimeout(() => {
        const suggestedScore = Math.round(Math.random() * 10);
        const suggestions = [
          "The answer demonstrates partial understanding of the concept.",
          "The response shows good comprehension but lacks detail in some areas.",
          "Consider the clarity of explanation when evaluating this response.",
          "This response applies the concept correctly in the given context.",
        ];
        const randomSuggestion =
          suggestions[Math.floor(Math.random() * suggestions.length)];

        setAiSuggestion({
          suggestedScore,
          feedback: randomSuggestion,
          analysis:
            "The response contains key elements but could be improved by adding more specific examples.",
        });
      }, 1000);
    } catch (error) {
      console.error("Error generating AI suggestion:", error);
    }
  };

  // Apply AI suggestion
  const applyAISuggestion = () => {
    if (aiSuggestion) {
      setScore(aiSuggestion.suggestedScore);
      setFeedback(
        feedback
          ? `${feedback}\n\n${aiSuggestion.feedback}`
          : aiSuggestion.feedback
      );
    }
  };

  // Handle criteria score change
  const handleCriteriaScoreChange = (criterionId, value) => {
    setCriteriaScores((prev) => ({
      ...prev,
      [criterionId]: value[0],
    }));

    // Optionally update overall score based on criteria
    if (criteria.length > 0) {
      const totalScore = Object.values(criteriaScores).reduce(
        (sum, val) => sum + val,
        0
      );
      const averageScore = Math.round(totalScore / criteria.length);
      setScore(averageScore);
    }
  };

  const handleSubmitEvaluation = async () => {
    setSaving(true);
    try {
      const evaluationData = {
        score,
        feedback,
        notes: evaluationNotes,
        criteriaScores,
        evaluatedAt: new Date().toISOString(),
        status: "completed",
      };

      await submitEvaluation(examId, responseId, questionId, evaluationData);

      if (onEvaluationComplete) {
        onEvaluationComplete(questionId, evaluationData);
      }
    } catch (error) {
      console.error("Error submitting evaluation:", error);
    } finally {
      setSaving(false);
    }
  };

  const getScoreColor = (score) => {
    if (score < 4) return "destructive";
    if (score < 7) return "warning";
    return "success";
  };

  const renderScoreIndicator = (score) => {
    const color = getScoreColor(score);
    return (
      <div className="flex items-center">
        {color === "success" && (
          <CheckCircle2 className="text-green-500 mr-2 h-5 w-5" />
        )}
        {color === "warning" && (
          <AlertTriangle className="text-amber-500 mr-2 h-5 w-5" />
        )}
        {color === "destructive" && (
          <XCircle className="text-red-500 mr-2 h-5 w-5" />
        )}
        <Badge variant={color} className="text-sm">
          {score}/{maxScore}
        </Badge>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50 rounded-t-lg">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-semibold text-slate-800">
                Question Evaluation
              </CardTitle>
              <CardDescription className="text-sm text-slate-500 mt-1">
                {questionType === "multiple-choice"
                  ? "Multiple Choice Question"
                  : questionType === "essay"
                  ? "Essay Question"
                  : "Question"}
              </CardDescription>
            </div>
            {renderScoreIndicator(score)}
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <Tabs
            defaultValue="evaluation"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="question" className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Question
              </TabsTrigger>
              <TabsTrigger value="evaluation" className="flex items-center">
                <Edit3 className="h-4 w-4 mr-2" />
                Evaluation
              </TabsTrigger>
              <TabsTrigger value="criteria" className="flex items-center">
                <BarChart2 className="h-4 w-4 mr-2" />
                Criteria
              </TabsTrigger>
            </TabsList>

            <TabsContent value="question" className="space-y-4">
              <div className="p-4 bg-white rounded-md border border-slate-200">
                <div className="mb-4">
                  <h3 className="font-medium text-slate-700 mb-2">Question:</h3>
                  <p className="text-slate-700">{questionText}</p>
                </div>

                <Separator className="my-4" />

                <div className="mb-4">
                  <h3 className="font-medium text-slate-700 mb-2">
                    Student's Answer:
                  </h3>
                  <div className="p-3 bg-slate-50 rounded-md">
                    <p className="text-slate-700 whitespace-pre-wrap">
                      {studentAnswer}
                    </p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div>
                  <div className="flex items-center mb-2">
                    <h3 className="font-medium text-slate-700">
                      Expected Answer:
                    </h3>
                    <Badge variant="outline" className="ml-2">
                      Reference
                    </Badge>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-md">
                    <p className="text-slate-700 whitespace-pre-wrap">
                      {correctAnswer}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="evaluation" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-base text-slate-700">Score</Label>
                    <Badge variant={getScoreColor(score)} className="text-sm">
                      {score}/{maxScore}
                    </Badge>
                  </div>
                  <Slider
                    value={[score]}
                    max={maxScore}
                    step={1}
                    className="w-full"
                    onValueChange={(value) => setScore(value[0])}
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>0</span>
                    <span>{maxScore / 2}</span>
                    <span>{maxScore}</span>
                  </div>
                </div>

                <div>
                  <Label className="text-base text-slate-700 mb-2 block">
                    Feedback to Student
                  </Label>
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide constructive feedback on the student's answer..."
                    className="min-h-[120px] resize-none"
                  />
                </div>

                <div>
                  <Label className="text-base text-slate-700 mb-2 block">
                    Evaluation Notes
                  </Label>
                  <Textarea
                    value={evaluationNotes}
                    onChange={(e) => setEvaluationNotes(e.target.value)}
                    placeholder="Private notes on evaluation (not visible to student)..."
                    className="min-h-[80px] resize-none"
                  />
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Lightbulb className="text-blue-500 h-5 w-5 mr-2" />
                      <Label className="text-blue-700 font-medium">
                        AI Evaluation Assistant
                      </Label>
                    </div>
                    {!showAIAssist && (
                      <Button
                        onClick={generateAISuggestion}
                        variant="outline"
                        size="sm"
                        className="text-xs bg-white/50 text-blue-600 hover:bg-white/80"
                      >
                        Generate Suggestion
                      </Button>
                    )}
                  </div>

                  {showAIAssist && !aiSuggestion && (
                    <div className="flex items-center justify-center p-3">
                      <div className="h-5 w-5 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mr-2"></div>
                      <p className="text-sm text-blue-700">
                        Analyzing response...
                      </p>
                    </div>
                  )}

                  {aiSuggestion && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-blue-700 font-medium">
                          AI Suggested Score: {aiSuggestion.suggestedScore}/
                          {maxScore}
                        </p>
                        <Button
                          onClick={applyAISuggestion}
                          variant="outline"
                          size="sm"
                          className="text-xs bg-white text-blue-600 hover:bg-blue-100"
                        >
                          Apply Suggestion
                        </Button>
                      </div>
                      <p className="text-sm text-blue-600">
                        {aiSuggestion.feedback}
                      </p>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem
                          value="analysis"
                          className="border-blue-200"
                        >
                          <AccordionTrigger className="text-xs text-blue-700 py-1">
                            Show detailed analysis
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="text-xs text-blue-600">
                              {aiSuggestion.analysis}
                            </p>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="criteria" className="space-y-4">
              <ScrollArea className="max-h-[300px] pr-3">
                {criteria.length > 0 ? (
                  <div className="space-y-4">
                    {criteria.map((criterion) => (
                      <div
                        key={criterion.id}
                        className="p-4 bg-white rounded-md border border-slate-200"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-medium text-slate-700">
                              {criterion.name}
                            </h3>
                            <p className="text-sm text-slate-500">
                              {criterion.description}
                            </p>
                          </div>
                          <Badge
                            variant={getScoreColor(
                              criteriaScores[criterion.id] || 0
                            )}
                            className="ml-2"
                          >
                            {criteriaScores[criterion.id] || 0}/{maxScore}
                          </Badge>
                        </div>

                        <Slider
                          value={[criteriaScores[criterion.id] || 0]}
                          max={maxScore}
                          step={1}
                          className="w-full"
                          onValueChange={(value) =>
                            handleCriteriaScoreChange(criterion.id, value)
                          }
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-1">
                          <span>Poor</span>
                          <span>Average</span>
                          <span>Excellent</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-4">
                    <p className="text-slate-500">
                      No evaluation criteria available
                    </p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="bg-slate-50 rounded-b-lg flex justify-between">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-xs text-slate-500 italic">
                  {existingEvaluation ? (
                    <span>
                      Last evaluated:{" "}
                      {new Date(
                        existingEvaluation.evaluatedAt
                      ).toLocaleString()}
                    </span>
                  ) : (
                    <span>Not yet evaluated</span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Evaluation status</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            onClick={handleSubmitEvaluation}
            disabled={saving}
            className={cn("transition-all", saving ? "opacity-80" : "")}
          >
            {saving ? (
              <>
                <div className="h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                Saving...
              </>
            ) : existingEvaluation ? (
              "Update Evaluation"
            ) : (
              "Save Evaluation"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResponseQuestionEvaluator;
